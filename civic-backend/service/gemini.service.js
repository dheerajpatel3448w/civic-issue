import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import * as fs from "node:fs";





function getMimeTypeFromUrl(url) {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".heic")) return "image/heic";
  if (url.endsWith(".heif")) return "image/heif";
  // Default fallback
  return "image/jpeg";
}

export async function main(imageUrl) {
  console.log(imageUrl);
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, // ✅ env variable zaroori hai
  });

  // Detect MIME type from URL
  const mimeType = getMimeTypeFromUrl(imageUrl);

  // Fetch image and convert to base64
  const response = await fetch(imageUrl);
  
  const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");
console.log(base64ImageData)
  // Send request to Gemini
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64ImageData,
        },
      },
      { text: 
      `You are an AI civic issue analyzer. 
Look at the given image and return the analysis in JSON format only. 
Do not add any extra text or explanation outside JSON. 
The JSON format should be:

{
  "problem_type": "string",       // Example: pothole, garbage, broken streetlight, water leakage
  "severity_level": "low | medium | high",
  "location_needed": true/false,  // true if location required for fixing
  "description": "string"  // short description of the problem
   "department":"string"  //give the department name which work on this problem and choose one of them
                            department name are : [
                             "waste_management",      for  Garbage, dumping, sanitation, sewer cleaning
                             "public_works",          for  Roads, street maintenance, potholes, construction
                             "road_transport",        for  Traffic, signals, parking, encroachments
                             "water_supply",          for  Drinking water, pipe leakage, low pressure
                             "sewage_and_drainage",   for  Drainage blockage, sewage overflow
                             "electricity",           for  Street lights, power outage, electric poles
                             "environment",           for  Pollution, tree cutting, deforestation
                             "health",                for  Public health, mosquito control, disease outbreak
                             "housing_and_urban_dev", for  Illegal construction, building maintenance
                             "parks_and_recreation",  for  Park cleanliness, broken benches, play areas
                             "animal_control",        for  Stray dogs, cattle menace, dead animals
                             "fire_and_safety",       for  Fire hazard, unsafe structures
                             "law_and_order",         for  Public nuisance, illegal activities
                             "municipal_tax",         for  Property tax, bill disputes
                             "other"                  for  For anything not mapped
                            ]

   "skills": ["String"]    //give the skills of worker which needed to solve this problem   
                           i give you skills but do not choose all skills of a department because example asssume that if little amount of  garbage are present in this site but you choose in the skills are truck driver but this is not correct why truck driver needed for the little garbage, so choose the skills in very precise manner and choose those skills of a department which are important 
                           skills are : {
                                "waste_management": [
                                  "sanitation_worker",
                                  "garbage_collector",
                                  "waste_truck_driver",
                                  "cleaning_staff",
                                  "recycling_staff",
                                  "landfill_operator",
                                  "street_sweeper",
                                  "waste_sorting_worker"
                                ],
                                "public_works": [
                                  "road_maintenance_worker",
                                  "construction_labour",
                                  "civil_engineer",
                                  "pothole_repair_team",
                                  "asphalt_layer",
                                  "bridge_repair_worker",
                                  "mason",
                                  "painter"
                                ],
                                "road_transport": [
                                  "traffic_police",
                                  "parking_attendant",
                                  "road_sign_technician",
                                    "signal_maintenance_worker",
                                    "highway_patrol",
                                    "toll_worker"
                                  ],
                                  "water_supply": [
                                    "plumber",
                                    "pipe_fitter",
                                    "water_line_inspector",
                                    "pump_operator",
                                    "leak_detection_worker",
                                    "water_quality_tester",
                                    "pipeline_welder"
                                  ],
                                  "sewage_and_drainage": [
                                    "drain_cleaner",
                                    "sewage_worker",
                                    "sanitation_engineer",
                                    "septic_tank_cleaner",
                                    "storm_drain_inspector",
                                    "hydro_jet_operator"
                                  ],
                                  "electricity": [
                                    "electrician",
                                    "lineman",
                                    "street_light_technician",
                                    "transformer_technician",
                                    "cable_repair_worker",
                                    "electrical_inspector"
                                  ],
                                  "environment": [
                                    "tree_plantation_worker",
                                    "gardener",
                                    "pollution_control_staff",
                                    "river_cleaning_worker",
                                    "air_quality_inspector",
                                    "green_energy_technician"
                                  ],
                                  "health": [
                                    "health_worker",
                                    "mosquito_control_staff",
                                    "public_health_inspector",
                                    "first_aid_staff",
                                    "sanitation_nurse",
                                    "epidemic_response_team"
                                  ],
                                  "housing_and_urban_dev": [
                                    "building_inspector",
                                    "civil_engineer",
                                    "demolition_worker",
                                    "architectural_drafter",
                                    "structural_engineer",
                                    "urban_planner"
                                  ],
                                  "parks_and_recreation": [
                                    "gardener",
                                    "park_maintenance_worker",
                                    "play_equipment_technician",
                                    "tree_trimmer",
                                    "fountain_mechanic",
                                    "lawn_care_staff"
                                  ],
                                  "animal_control": [
                                    "dog_catcher",
                                    "veterinary_staff",
                                    "animal_shelter_worker",
                                    "wildlife_rescuer",
                                    "animal_health_inspector"
                                  ],
                                  "fire_and_safety": [
                                    "firefighter",
                                    "safety_inspector",
                                    "rescue_team_member",
                                    "fire_extinguisher_technician",
                                    "disaster_response_worker"
                                  ],
                                  "law_and_order": [
                                    "police_officer",
                                    "security_guard",
                                    "crime_investigation_staff",
                                    "traffic_regulation_staff",
                                    "beat_constable"
                                  ],
                                  "municipal_tax": [
                                    "tax_officer",
                                    "billing_staff",
                                    "accountant",
                                       "auditor",
                                       "revenue_collector"
                                     ],
                                     "other": [
                                       "general_worker",
                                       "complaint_forwarding_staff",
                                       "multi_task_helper"
                                     ]
}

} `},
    ],
  });

  // Extract text safely
  console.log(
    result.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No text response"
  );
    let d =   result.candidates?.[0]?.content?.parts?.[0]?.text
  let f = JSON.parse(d.replace("json","").replaceAll("```",""))
  console.log(f)
  return f
}
































export async function compareCleaning(path1,path2) {
  try {
    // Validate input paths
    if (!path1 || !path2) {
      throw new Error('Both path1 and path2 are required');
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyAQiLeVVh6lnduqpOrOuZIpP2xCXfP9xh0",
    });

    // BEFORE IMAGE (from Cloudinary)
    const beforeImageUrl = path1;

    // AFTER IMAGE (uploaded by worker - stored locally)
    const afterImagePath = path2; // Adjust path as per your setup
    const base64AfterImage = fs.readFileSync(afterImagePath, { encoding: "base64" });

    // Create request to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Best for vision comparison
      contents: createUserContent([
        "Compare these two images. The first one is BEFORE cleaning, the second is AFTER cleaning. Tell if cleaning was done effectively.",
        // First image (from Cloudinary)
        createPartFromUri(beforeImageUrl, "image/jpeg"),
        // Second image (local worker upload)
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64AfterImage,
          },
        },
      ]),
    });

    console.log("AI Analysis:\n", response);
  } catch (error) {
    console.error("Error comparing images:", error);
  }
}

