// app/api/scan-stats/route.js

export async function GET() {
  // You can fetch this data from a database or calculate based on previous scans
  const stats = {
    totalScans: 33,
    issuesFound: 7,
    threatsBlocked: 2,
  };

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
