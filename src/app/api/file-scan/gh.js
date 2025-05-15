import { NextResponse } from "next/server";

const API_KEYS = [
  "a9442725b4f377c0d308c043adf6ced518728174368f0d32b16a53fba621af4b",
  "0748e2d02ac21d3b6d46ebd06448f403d4969dfb71cfbc1a5ebe34131be2d414",
];

let apiIndex = 0;
function getNextApiKey() {
  const key = API_KEYS[apiIndex];
  apiIndex = (apiIndex + 1) % API_KEYS.length;
  return key;
}

async function waitForAnalysisComplete(analysisId) {
  const MAX_RETRIES = 20;
  const WAIT_MS = 5000;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const res = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: { "x-apikey": getNextApiKey() },
    });

    const data = await res.json();

    // Handle 409 ConflictError
    if (res.status === 409 || data?.error?.code === "ConflictError") {
      await new Promise((r) => setTimeout(r, WAIT_MS));
      continue;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch analysis status: ${res.status}`);
    }

    if (data?.data?.attributes?.status === "completed") {
      return { status: "completed", data };
    }

    await new Promise((r) => setTimeout(r, WAIT_MS));
  }

  // Instead of throwing, return pending status
  return { status: "pending", analysisId };
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const blob = new Blob([buffer]);

    const uploadForm = new FormData();
    uploadForm.append("file", blob, file.name);

    const uploadResponse = await fetch("https://www.virustotal.com/api/v3/files", {
      method: "POST",
      headers: { "x-apikey": getNextApiKey() },
      body: uploadForm,
    });

    const uploadJson = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return NextResponse.json({ error: uploadJson }, { status: uploadResponse.status });
    }

    const analysisId = uploadJson.data.id;
    const analysisResult = await waitForAnalysisComplete(analysisId);

    if (analysisResult.status === "pending") {
      return NextResponse.json({
        status: "pending",
        message: "Analysis is still in progress. Please retry later.",
        analysisId,
      }, { status: 202 });
    }

    const vtResp = analysisResult.data;
    const { id, attributes: attrs } = vtResp.data;
    const { stats, results, size, date, file_type, extension } = attrs;

    const detection_stats = {
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      clean: stats.undetected,
      total: stats.malicious + stats.suspicious + stats.undetected,
    };

    const detection_details = Object.entries(results).map(([engine, r]) => ({
      engine,
      category: r.category === "undetected" ? "clean" : r.category,
      result: r.result,
      engine_version: r.engine_version,
      engine_update: r.engine_update,
    }));

    const threat_info = {
      severity: null,
      category: null,
      name: null,
      description: null,
    };

    const file_metadata = {
      name: file.name,
      hash: {
        md5: null,
        sha1: null,
        sha256: id,
      },
      mime_type: null,
      created: null,
      modified: null,
    };

    return NextResponse.json({
      data: {
        id,
        type: "file",
        attributes: {
          size: size || 0,
          scan_date: date || 0,
          file_type: file_type || "",
          extension: extension || "",
          detection_stats,
          threat_info,
          file_metadata,
          tags: [],
          detection_details,
        },
      },
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
