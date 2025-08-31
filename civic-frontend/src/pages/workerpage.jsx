/*
WorkerTaskPage.jsx

Usage:
1. Drop this file into your React app (e.g. src/pages/WorkerTaskPage.jsx).
2. Install Tailwind / ensure styles are available.
3. Add route in your router: /worker/task?taskId=<id>&token=<one-time-token>
4. Provide these backend endpoints:
   - GET  /api/tasks/:taskId?token=<token> -> returns JSON { taskId, issue, location: {lat,lng,address}, reportedImage }
   - POST /api/tasks/:taskId/upload?token=<token> -> accepts multipart/form-data with field 'proof' (image file)
5. Provide a public Mappls JS key in .env (frontend): REACT_APP_MAPPLS_KEY.

What this component does:
- Fetches task details using taskId + token
- Renders Mappls interactive map centred on task location with a marker
- Shows task details and reported image (if present)
- Lets worker capture photo from device camera (or pick file) and preview it
- Uploads the captured image to the backend for verification
- Shows upload progress and result

Note: This component uses the MapmyIndia / Mappls JS SDK. Replace script/initialization if you prefer Leaflet or Mapbox.
*/

import React, { useEffect, useRef, useState } from 'react';

export default function WorkerTaskPage() {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  // parse query params for taskId and token
  function getQuery() {
    const qp = new URLSearchParams(window.location.search);
    return {
      taskId: qp.get('taskId'),
      token: qp.get('token')
    };
  }

  useEffect(() => {
    const { taskId, token } = getQuery();
    if (!taskId || !token) {
      setError('Missing taskId or token in URL');
      setLoading(false);
      return;
    }

    // fetch task details
    fetch(`${import.meta.env.VITE_API_URL}/task/${taskId}?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load task: ' + (err.message || err));
        setLoading(false);
      });
  }, []);

  // Initialize Mappls map once task is loaded
  useEffect(() => {
    if (!task) return;
    const key = import.meta.env.REACT_APP_MAPPLS_KEY || '';
    if (!key) {
      console.warn('REACT_APP_MAPPLS_KEY not set — map might not load');
    }

    // Dynamically load Mappls script if not present
    if (!window.MapmyIndia) {
      const s = document.createElement('script');
      s.src = `https://apis.mapmyindia.com/advancedmaps/v1/${key}/map_load?v=1.5`;
      s.onload = () => initMap();
      document.head.appendChild(s);
    } else {
      initMap();
    }

    function initMap() {
      try {
        const { lat, lon } = task.location;
        // eslint-disable-next-line no-undef
        const map = new MapmyIndia.Map('map-canvas', {
          center: [lat, lon],
          zoomControl: true,
          marquee: false,
          zoom: 15
        });

        // add marker
        // eslint-disable-next-line no-undef
        const marker = new L.marker([lat, lon]).addTo(map);
        marker.bindPopup(task.location.address || 'Task location').openPopup();

        mapRef.current = map;
      } catch (e) {
        console.error('Map init error', e);
      }
    }

    // cleanup: none
  }, [task]);

  // Camera stream
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      console.error('Camera error', e);
      setError('Camera access denied or not available');
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setPreviewSrc({ blob, url });
    }, 'image/jpeg', 0.9);
  }

  function stopCamera() {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      video.srcObject = null;
    }
  }

  async function uploadProof() {
    if (!previewSrc || !previewSrc.blob) {
      setError('No photo to upload');
      return;
    }
    const { taskId, token } = getQuery();
    const fd = new FormData();
    fd.append('proof', previewSrc.blob, `proof-${taskId}.jpg`);

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/task/${taskId}/upload?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || JSON.stringify(json));
      setUploadResult({ ok: true, msg: json.message || 'Uploaded' });
      // optionally stop camera
      stopCamera();
    } catch (e) {
      console.error('Upload failed', e);
      setUploadResult({ ok: false, msg: e.message });
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="p-8">Loading task...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Task Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-4 border rounded">
            <h2 className="font-medium">Issue</h2>
            <p className="text-gray-700">{task.issue || 'No description provided'}</p>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-medium">Reported Image</h2>
            {task.reportedImage ? (
              <img src={task.reportedImage} alt="reported" className="w-full object-cover rounded mt-2" />
            ) : (
              <p className="text-sm text-gray-500">No image provided</p>
            )}
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-medium">Location</h2>
            <p className="text-gray-700">{task.location.address}</p>
            <a
              className="inline-block mt-2 text-sm text-blue-600"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location.lat + ',' + task.location.lon)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div>
          <div id="map-canvas" className="w-full h-64 mb-4 border rounded"></div>

          <div className="p-4 border rounded">
            <h2 className="font-medium mb-2">Capture Proof</h2>

            <div className="space-y-2">
              <div className="video-area">
                <video ref={videoRef} className="w-full rounded border" playsInline muted></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              </div>

              {!previewSrc && (
                <div className="flex gap-2">
                  <button onClick={startCamera} className="px-3 py-2 bg-green-600 text-white rounded">Start Camera</button>
                  <button onClick={capturePhoto} className="px-3 py-2 bg-blue-600 text-white rounded">Capture Photo</button>
                  <label className="px-3 py-2 bg-gray-200 rounded cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) {
                        setPreviewSrc({ blob: f, url: URL.createObjectURL(f) });
                      }
                    }} style={{ display: 'none' }} />
                    Upload from device
                  </label>
                </div>
              )}

              {previewSrc && (
                <div className="space-y-2">
                  <img src={previewSrc.url} alt="preview" className="w-full rounded border" />
                  <div className="flex gap-2">
                    <button onClick={uploadProof} disabled={uploading} className="px-3 py-2 bg-indigo-600 text-white rounded">{uploading ? 'Uploading...' : 'Upload Proof'}</button>
                    <button onClick={() => { setPreviewSrc(null); setUploadResult(null); }} className="px-3 py-2 border rounded">Retake / Choose another</button>
                  </div>
                </div>
              )}

              {uploadResult && (
                <div className={`p-2 rounded ${uploadResult.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{uploadResult.msg}</div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
