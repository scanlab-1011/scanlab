import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ScanForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL to scan");
      return;
    }

    if (!validateUrl(url.trim())) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setError("");
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Scan a Website
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mb-4">
          Enter a URL below to check for potential security threats
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 dark:bg-red-700 dark:text-white">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL to scan (e.g., https://example.com)"
            className="pr-10 h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
            disabled={isLoading}
          />
          <Shield className="absolute right-3 top-3 h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <Button
          type="submit"
          className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-md shadow-lg disabled:opacity-50 dark:from-violet-700 dark:to-indigo-700 dark:hover:from-violet-800 dark:hover:to-indigo-800"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <span className="mr-2 animate-spin">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Scanning...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" /> Scan URL
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ScanForm;
