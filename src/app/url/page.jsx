'use client';
import { useState } from 'react';

export default function ScanPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/url-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🔍 VirusTotal URL Scanner</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL to scan"
          className="flex-1 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleScan}
          disabled={loading || !url}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Scanning...' : 'Scan URL'}
        </button>
      </div>

      {error && <p className="text-red-600 font-medium mb-4">❌ {error}</p>}

      {result && (
        <div className="space-y-6">
          {/* URL Info */}
          <section className="bg-white shadow-md border rounded p-5">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">🌐 URL Details</h2>
            <p><strong>URL:</strong> <a href={result.meta?.url_info?.url} className="text-blue-600 underline" target="_blank">{result.meta?.url_info?.url}</a></p>
            <p><strong>ID:</strong> {result.meta?.url_info?.id}</p>
            <p><strong>SHA256:</strong> {result.meta?.file_info?.sha256}</p>
          </section>

          {/* Scan Stats */}
          <section className="bg-white shadow-md border rounded p-5">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">📊 Scan Statistics</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm">
              {Object.entries(result.stats).map(([key, value]) => (
                <li key={key}>
                  <strong className="capitalize">{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </section>

          {/* Scan Results Table */}
          <section className="bg-white shadow-md border rounded p-5 overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">🧪 Detection Engines</h2>
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border-b">Engine Name</th>
                  <th className="py-2 px-3 border-b">Result</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((engine, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-3">{engine.engine_name}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        engine.result === 'clean'
                          ? 'text-green-600'
                          : engine.result === 'malicious'
                          ? 'text-red-600'
                          : engine.result === 'suspicious'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {engine.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </main>
  );
}
