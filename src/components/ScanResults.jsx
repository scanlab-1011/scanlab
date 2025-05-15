"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  FileCode,
  Tag,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ScanResults = ({ scanResult }) => {
  const { data } = scanResult || {};
  const { attributes } = data || {};
  const stats = attributes?.detection_stats || {};
  const threatInfo = attributes?.threat_info || {};
  const fileMetadata = attributes?.file_metadata || {};
  const detectionDetails = attributes?.detection_details || [];
  const tags = attributes?.tags || [];

  const maliciousEngines = detectionDetails

    .filter((d) => d.category === "malicious" || d.category === "suspicious")
    .sort((a, b) => {
      if (a.category === "malicious" && b.category === "suspicious") return -1;
      if (a.category === "suspicious" && b.category === "malicious") return 1;
      return 0;
    });

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };
  const getThreatLevel = (maliciousCount, suspiciousCount) => {
    if (maliciousCount > 3) {
      return {
        level: "High Risk",
        color:
          "bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-red-900 font-semibold",
      };
    }
    if (maliciousCount > 0) {
      return {
        level: "Moderate Risk",
        color:
          "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-yellow-900 font-semibold",
      };
    }
    if (suspiciousCount > 5) {
      return {
        level: "Suspicious",
        color:
          "bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 text-orange-900 font-semibold",
      };
    }
    if (suspiciousCount > 0) {
      return {
        level: "Low Risk",
        color:
          "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-blue-900 font-semibold",
      };
    }
    return {
      level: "Safe",
      color:
        "bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-green-900 font-semibold",
    };
  };

  const getBadgeVariant = (severity) => {
    switch (severity) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
      default:
        return "outline";
    }
  };

  const detectionRatePercent =
    stats.total && stats.total > 0
      ? ((stats.malicious + stats.suspicious) / stats.total) * 100
      : 0;
  const cleanPercent =
    stats.total && stats.total > 0 ? (stats.clean / stats.total) * 100 : 0;

  const threatLevelInfo = getThreatLevel(stats.malicious, stats.suspicious);
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Malicious
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {stats.malicious || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Suspicious
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {stats.suspicious || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Clean
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {stats.clean || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {stats.total || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card shadow-sm h-full">
            <CardHeader>
              <CardTitle>Threat Analysis</CardTitle>
              <CardDescription>
                Comprehensive analysis from multiple security engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detections">Detections</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Detection Rate</h3>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${threatLevelInfo.color}`}
                        style={{
                          width: `${detectionRatePercent.toFixed(2)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>
                        {Math.round(detectionRatePercent)}% threats detected
                      </span>
                      <span>{Math.round(cleanPercent)}% clean</span>
                    </div>
                  </div>

                  {threatInfo && threatInfo.severity ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Threat Classification
                        </h3>
                        <div className="bg-secondary/10 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Threat Name</span>
                            <Badge
                              variant={getBadgeVariant(threatInfo.severity)}
                            >
                              {threatInfo.name || "N/A"}
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <span className="text-sm font-medium">
                              Severity Level
                            </span>
                            <div className="flex items-center mt-1 gap-2">
                              <Badge
                                variant={getBadgeVariant(threatInfo.severity)}
                              >
                                {threatInfo.severity.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground italic">
                                {threatInfo.category || "Unknown"}
                              </span>
                            </div>
                          </div>
                          {threatInfo.description && (
                            <div className="mt-3 text-sm text-muted-foreground">
                              <span className="font-medium">Description: </span>
                              {threatInfo.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No threat information available.
                    </p>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      File Attributes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "File Size",
                          value: formatFileSize(attributes?.size),
                        },
                        {
                          label: "File Type",
                          value: attributes?.file_type || "N/A",
                        },
                        {
                          label: "Last Scanned",
                          value: formatDate(attributes?.scan_date),
                        },
                        {
                          label: "Extension",
                          value: attributes?.extension || "N/A",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-secondary/10 p-3 rounded-md"
                        >
                          <div className="text-xs text-muted-foreground">
                            {item.label}
                          </div>
                          <div className="font-medium text-sm">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Tag className="h-4 w-4" /> Behavior Tags
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="detections" className="space-y-4">
                  {maliciousEngines.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto pr-2">
                      {maliciousEngines.map((engine, index) => (
                        <div
                          key={index}
                          className={`mb-3 p-3 bg-secondary/10 rounded-md border-l-4 ${
                            engine.category === "malicious"
                              ? "border-red-500"
                              : "border-amber-500"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{engine.engine}</span>
                            <Badge
                              variant={
                                engine.category === "malicious"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {engine.result || "Detected"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {engine.engine_version &&
                              `Version: ${engine.engine_version}`}
                            {engine.engine_version &&
                              engine.engine_update &&
                              " | "}
                            {engine.engine_update &&
                              `Updated: ${engine.engine_update}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                      <p className="text-lg font-medium">No Threats Detected</p>
                      <p className="text-sm">
                        This file wasn't identified as malicious by any engine
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card shadow-sm h-full">
            <CardHeader>
              <CardTitle>File Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(fileMetadata).length > 0 ? (
                  Object.entries(fileMetadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col border-b border-border pb-2"
                    >
                      <span className="font-medium text-sm capitalize mb-1">
                        {key.replace(/_/g, " ")}
                      </span>
                      {typeof value === "object" && value !== null ? (
                        <div className="pl-2 space-y-1">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <div
                              key={subKey}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {subKey.toUpperCase()}
                              </span>
                              <span
                                className="truncate max-w-[200px] text-right"
                                title={subValue}
                              >
                                {subValue || "Not available"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span
                          className="text-sm truncate max-w-full"
                          title={value}
                        >
                          {value !== null && value !== undefined
                            ? value
                            : "Not available"}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No metadata available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
