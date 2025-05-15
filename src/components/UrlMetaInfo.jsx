import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from 'lucide-react';

const UrlMetaInfo = ({ vtScanResult }) => {
  const [showFullUrl, setShowFullUrl] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vtScanResult && vtScanResult.page) {
      setLoading(false);
    } else {
      setLoading(false); // Avoid infinite loading if vtScanResult is missing
    }
  }, [vtScanResult]);

  // Early return if both are missing
  if (!vtScanResult && !vtScanResult?.page) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
      </div>
    );
  }

  const {
    url = 'N/A',
    title = 'No Title available',
    status = 'Status code unavailable',
    mimeType = 'MIME type not provided',
    ip = 'IP Address not available',
    tlsIssuer = 'TLS Issuer information unavailable',
    city = 'City unavailable',
    country = 'Country unavailable',
    apexDomain = 'Apex Domain unavailable',
    umbrellaRank = 'Umbrella Rank unavailable',
  } = vtScanResult?.page || {};

  const resultLink = vtScanResult?.result_link || null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">URL Information</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {/* Target URL */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <ExternalLink className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Target URL</h4>
                <p className="text-sm break-all font-mono p-2 rounded border 
                               bg-gray-50 dark:bg-gray-800 
                               border-gray-200 dark:border-gray-700 
                               text-gray-800 dark:text-gray-100">
                  {showFullUrl ? url : `${url.slice(0, 40)}...`}
                  <button
                    onClick={() => setShowFullUrl(!showFullUrl)}
                    className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 text-xs ml-2"
                  >
                    {showFullUrl ? 'Show Less' : 'Show Full'}
                  </button>
                </p>
              </div>
            </div>

            <Separator />

            {/* Title, Status Code, MIME */}
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Title</h4>
                <p className="text-xs font-mono truncate">{title}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Status Code</h4>
                <p className="text-xs font-mono truncate">{status}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">MIME Type</h4>
                <p className="text-xs font-mono truncate">{mimeType}</p>
              </div>
            </div>

            <Separator />

            {/* IP, Location, Domain */}
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">IP Address</h4>
                <p className="text-xs font-mono truncate">{ip}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Location</h4>
                <p className="text-xs font-mono truncate">{city}, {country}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Apex Domain</h4>
                <p className="text-xs font-mono truncate">{apexDomain}</p>
              </div>
            </div>

            <Separator />

            {/* TLS Issuer */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">TLS Issuer</h4>
              <p className="text-xs font-mono truncate">{tlsIssuer}</p>
            </div>

            <Separator />

            {/* Umbrella Rank */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Umbrella Rank</h4>
              <p className="text-xs font-mono">{umbrellaRank}</p>
            </div>

            <Separator />

            {/* Result Link */}
            {resultLink ? (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Scan Result</h4>
                <a
                  href={resultLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 text-xs"
                >
                  View Scan Result
                </a>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">No scan result available.</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlMetaInfo;
