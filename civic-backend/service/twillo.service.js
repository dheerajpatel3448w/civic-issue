import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendWhatsAppMessage(to, message, countryCode = '+91') {
  try {
    // Validate required environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file.');
    }

    if (!process.env.TWILIO_WHATSAPP_FROM) {
      throw new Error('TWILIO_WHATSAPP_FROM not configured. Please set it in your .env file.');
    }

    const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
    const toNumber = `whatsapp:${countryCode}${to}`;

    console.log(`Sending WhatsApp message from ${fromNumber} to ${toNumber}`);

    const response = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: message
    });

    console.log('Message sent successfully:', {
      sid: response.sid,
      status: response.status,
      to: response.to,
      from: response.from
    });

    return {
      success: true,
      sid: response.sid,
      status: response.status
    };
  
  } 
  catch (error) {
    console.error('Error sending WhatsApp message:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });

    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}
