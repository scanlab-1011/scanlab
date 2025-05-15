import axios from 'axios';

const API_KEYS = [
  '21ed5f8c-bd50-42ea-8b0e-6d5eb22fd36a',
];

const getRandomApiKey = () => {
  const index = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[index];
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid or missing URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = getRandomApiKey();

    // Step 1: Submit the URL for scanning
    const submission = await axios.post('https://urlscan.io/api/v1/scan/', {
      url: url,
      visibility: 'public',
      tags: ['nextjs', 'scan']
    }, {
      headers: {
        'API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const scanId = submission.data.uuid;
    const resultUrl = `https://urlscan.io/api/v1/result/${scanId}/`;

    // Step 2: Poll until results are available
    let scanResult = null;
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      const result = await axios.get(resultUrl, {
        headers: { 'API-Key': apiKey },
        validateStatus: false,
      });

      

      if (result.status === 200) {
        scanResult = result.data;
        break;
      } else if (result.status === 404) {
        await sleep(5000); // Wait 5 seconds and retry
      } else {
        console.error(`Unexpected response status: ${result.status}`);
        break;
      }
    }

    if (!scanResult) {
      return new Response(JSON.stringify({ error: 'Scan result not ready. Try again later.' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Format response
    const formatted = {
      scan_id: scanId,
      result_link: `https://urlscan.io/result/${scanId}/`,
      page: scanResult.page,
      links: scanResult.data?.links || [],
    };

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('URLScan Error:', error); // Log the full error
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
