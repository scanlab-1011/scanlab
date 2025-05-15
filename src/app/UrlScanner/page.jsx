"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ScanForm from "@/components/ScanForm";
import ScanResultChart from "@/components/ScanResultChart";
import ScanResultSummary from "@/components/ScanResultSummary";
import EngineResults from "@/components/EngineResults";
import UrlMetaInfo from "@/components/UrlMetaInfo";
import { ExternalLink } from "lucide-react";

export default function UrlScannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [vtScanResult, setVtScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [vtQueued, setVtQueued] = useState(false);

  const handleScan = async (url) => {
    setIsLoading(true);
    setErrorMessage(null);
    setVtQueued(false);
    setScanResult(null);
    setVtScanResult(null);

    try {
      const scanApi = fetch("/api/url-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const vtApi = fetch("/api/VT-scan-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // Run both API calls concurrently
      const [scanRes, vtRes] = await Promise.all([scanApi, vtApi]);

      const scanData = await scanRes.json();
      if (!scanRes.ok) throw new Error(scanData.error || "Scan failed");

      const vtData = await vtRes.json();
      const status = vtData?.data?.attributes?.status;

      // Set scan result
      setScanResult(scanData);

      if (status === "queued") {
        setVtQueued(true);
      } else if (!vtRes.ok) {
        throw new Error(vtData.error || "VT Scan failed");
      } else {
        setVtScanResult(vtData);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
      console.error("Scan error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScanStatus = (scanResult) => {
    const url = scanResult?.meta?.url_info?.url;
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
      >
        {url}
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    ) : (
      "Unknown URL"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8 shadow-lg border-t-4 border-indigo-500 dark:bg-gray-800 dark:border-indigo-600">
          <ScanForm onSubmit={handleScan} isLoading={isLoading} />
        </Card>

        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-violet-200 h-20 w-20 mb-4 flex items-center justify-center dark:bg-violet-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 dark:border-violet-400"></div>
              </div>
              <p className="text-lg font-medium text-violet-900 dark:text-violet-100">
                Analyzing URL...
              </p>
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">This may take a few moments</p>
            </div>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="text-red-600 text-center mt-4">
            <p>{errorMessage}</p>
          </div>
        )}

        {scanResult && !isLoading && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-indigo-500 rounded dark:bg-indigo-600"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scan Results</h2>
                <p className="text-gray-500 dark:text-gray-300">Analysis for {getScanStatus(scanResult)}</p>
              </div>
            </div>

            <ScanResultSummary stats={scanResult.stats} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-1">
                <Card className="h-full shadow-md dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-white">Scan Statistics</h3>
                    <ScanResultChart stats={scanResult.stats} />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-1">
                {scanResult.meta && <UrlMetaInfo meta={scanResult.meta} />}
                <UrlMetaInfo vtScanResult={vtScanResult} />
              </div>
            </div>

            <EngineResults results={scanResult.results} />

            <div className="text-center text-sm text-gray-500 py-6 border-t border-gray-200 mt-8 dark:text-gray-400 dark:border-gray-700">
              <p>
                This scan result is for educational purposes only. Always verify
                security information with multiple sources.
              </p>
            </div>
          </div>
        )}

        {vtQueued && !isLoading && (
          <div className="mt-6 text-center text-yellow-700 bg-yellow-100 border border-yellow-300 px-4 py-3 rounded dark:text-yellow-200 dark:bg-yellow-800 dark:border-yellow-600">
            <p>
              VirusTotal is still processing the scan for this URL. Please refresh
              the page after some time to view the results.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
