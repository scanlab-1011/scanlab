"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import ScanResults from "@/components/ScanResults";
import EmptyState from "@/components/EmptyState";

const HomePage = () => {
  const [uploadState, setUploadState] = useState({
    file: null,
    base64: null,
    scanResult: null,
    isLoading: false,
    error: null,
  });

  const handleFileUpload = async (file, base64) => {
    setUploadState({
      file,
      base64,
      scanResult: null,
      isLoading: true,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/file-scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to scan file");

      const scanResult = await res.json();

      setUploadState((prev) => ({
        ...prev,
        scanResult,
        isLoading: false,
      }));

      toast.success("Security analysis completed!");
    } catch (error) {
      console.error("Error analyzing file:", error);
      setUploadState((prev) => ({
        ...prev,
        error: "Failed to analyze the file. Please try again later.",
        isLoading: false,
      }));
      toast.error("Failed to analyze the file. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-blue-300">
            Advanced File Security Scanner
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a file to analyze it for potential security risks using our
            advanced multi-engine detection system.
          </p>

          <FileUpload
            onFileUpload={handleFileUpload}
            isLoading={uploadState.isLoading}
          />
        </section>

        {uploadState.isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center p-10 text-center animate-pulse"
          >
            <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Analyzing File...
            </h3>
            <p className="text-gray-500">
              Running comprehensive security analysis
            </p>
          </div>
        )}

        {!uploadState.isLoading && uploadState.error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-300"
          >
            {uploadState.error}
          </div>
        )}

        {!uploadState.isLoading && uploadState.scanResult && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-white">
              Scan Results
            </h2>
            <ScanResults scanResult={uploadState.scanResult} />
          </section>
        )}

        {!uploadState.isLoading &&
          !uploadState.scanResult &&
          !uploadState.error && <EmptyState />}
      </main>
    </div>
  );
};

export default HomePage;
