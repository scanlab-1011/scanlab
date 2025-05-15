import axios from 'axios';

const API_KEYS = [
  'a9442725b4f377c0d308c043adf6ced518728174368f0d32b16a53fba621af4b',
  '0748e2d02ac21d3b6d46ebd06448f403d4969dfb71cfbc1a5ebe34131be2d414',
];

const getRandomApiKey = () => {
  const index = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[index];
};

const sleep = ms => new Promise(res => setTimeout(res, ms));

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

    const encodedParams = new URLSearchParams();
    encodedParams.set('url', url);

    const apiKey = getRandomApiKey();

    // Step 1: Submit URL to VirusTotal
    const submission = await axios.request({
      method: 'POST',
      url: 'https://www.virustotal.com/api/v3/urls',
      headers: {
        accept: 'application/json',
        'x-apikey': apiKey,
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: encodedParams,
    });

    const analysisId = submission.data.data.id;

    // Step 2: Poll for the full analysis result
    let report = null;
    const maxAttempts = 10;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const reportResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: {
          accept: 'application/json',
          'x-apikey': apiKey,
        },
      });


      if (reportResponse.data?.data?.attributes?.status === 'completed') {
        report = reportResponse.data;
        break;
      }

      await sleep(2000); // Wait 2s between polls
    }

    if (!report) {
      return new Response(JSON.stringify({ error: 'Report not ready. Try again later.' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Extract and format results
    const analysisData = report.data.attributes.results;
    const stats = report.data.attributes.stats;
    const meta = report.meta;

    const formattedResults = Object.keys(analysisData).map(engine => ({
      engine_name: analysisData[engine].engine_name,
      result: analysisData[engine].result,
    }));

    return new Response(JSON.stringify({
      stats,
      meta,
      results: formattedResults,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('VirusTotal Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
