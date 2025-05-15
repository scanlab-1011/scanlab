import { NextResponse } from 'next/server';

export async function GET() {
  const mockData = [
    {
      id: "scan-1",
      type: "URL",
      target: "https://1011.cloud",
      date: "2025-05-10T00:00:00.000Z",
      status: "safe",
    },
    {
      id: "scan-2",
      type: "File",
      target: "document.pdf",
      date: "2025-05-09T00:00:00.000Z",
      status: "warning",
    },
    {
      id: "scan-3",
      type: "IP",
      target: "192.168.1.1",
      date: "2025-05-08T00:00:00.000Z",
      status: "neutral",
    },
  ];

  return NextResponse.json(mockData);
}
