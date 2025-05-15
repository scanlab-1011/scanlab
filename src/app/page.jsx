"use client"; // Mark this as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScanCard from "@/components/ui/ScanCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { Shield, FileCheck, Search, Network } from "lucide-react";
import Link from "next/link";
import { getAllDeviceData } from "@/utils/deviceInfo";

export default function Dashboard() {
  const router = useRouter();

  const [recentScans, setRecentScans] = useState([]);
  const [scanStats, setScanStats] = useState({
    totalScans: 0,
    issuesFound: 0,
    threatsBlocked: 0,
  });

  const [deviceData, setDeviceData] = useState({
    deviceInfo: {},
    networkInfo: {},
    batteryInfo: {},
    clientIp: {},
    pluginsInfo: [],
    languageInfo: {},
    geolocationInfo: {},
    storageInfo: {},
    screenInfo: {},
    hardwareInfo: {},
    mediaInfo: [],
    appInfo: {},
  });

  useEffect(() => {
    async function fetchRecentScans() {
      const response = await fetch("/api/recent-scans");
      const data = await response.json();
      setRecentScans(data);
    }
    fetchRecentScans();
  }, []);

  useEffect(() => {
    async function fetchScanStats() {
      const response = await fetch("/api/scan-stats");
      const data = await response.json();
      setScanStats(data);
    }
    fetchScanStats();
  }, []);

  useEffect(() => {
    async function fetchDeviceData() {
      const data = await getAllDeviceData();
      setDeviceData(data);
    }
    fetchDeviceData();
  }, []);

  const handleQuickScan = () => {
    // Add quick scan logic here
  };

  const renderDeviceInfo = (label, value) => {
    if (!value || value === "Unknown") return null;
    const isBattery = label === "Battery";
    const batteryValue = isBattery ? parseFloat(value) : null;
    const valueStyle =
      isBattery && batteryValue < 15 ? "text-red-500 font-semibold" : "text-sm";

    return (
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className={valueStyle}>
          {isBattery ? `${batteryValue}%` : value}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 frosted-glass">
          <CardHeader>
            <CardTitle>Welcome to SecureScan</CardTitle>
            <CardDescription>
              Your comprehensive security scanning solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Get started by running a scan on a URL, file, or IP address.
            </p>
            <Button
              onClick={handleQuickScan}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition duration-300"
            >
              <Shield className="mr-2 h-4 w-4" />
              Quick Security Scan
            </Button>
          </CardContent>
        </Card>

        <Card className="frosted-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Scan Stats</CardTitle>
              <div className="p-2 rounded-full bg-blue-100">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Scans</span>
                <span className="text-xl font-bold">
                  {scanStats.totalScans}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Issues Found</span>
                <span className="text-xl font-bold text-yellow-500">
                  {scanStats.issuesFound}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Threats Blocked</span>
                <span className="text-xl font-bold text-red-600">
                  {scanStats.threatsBlocked}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="frosted-glass">
          <CardHeader>
            <CardTitle className="text-lg">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {renderDeviceInfo("Device", deviceData.deviceInfo.model)}
              {renderDeviceInfo("Battery", deviceData.batteryInfo.level)}
              {renderDeviceInfo("OS", deviceData.deviceInfo.platform)}
              {renderDeviceInfo(
                "Browser",
                deviceData.deviceInfo.browserVersion
              )}
              {renderDeviceInfo("IP Address", deviceData.clientIp.ip)}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight mt-8">
        Security Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScanCard
          title="URL Scanner"
          description="Scan websites for phishing and threats"
          icon={<Search className="h-5 w-5" />}
          actionLabel="Scan URL"
          onClick={() => router.push("/UrlScanner")}
        />
        <ScanCard
          title="File Scanner"
          description="Check files for viruses and malware"
          icon={<FileCheck className="h-5 w-5" />}
          actionLabel="Scan File"
          onClick={() => router.push("/file-scanner")}
        />
        <ScanCard
          title="IP Lookup"
          description="Check IP addresses for reputation and location"
          icon={<Network className="h-5 w-5" />}
          actionLabel="Lookup IP"
          onClick={() => router.push("/ip-lookup")}
        />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight mt-8">
        Recent Scans
      </h2>
      <div className="frosted-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Target
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-b last:border-0 hover:bg-muted/20"
                >
                  <td className="py-3 px-4 text-sm">{scan.type}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {scan.target}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(scan.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={scan.status} />
                  </td>
                  <td className="py-2 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                     
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-end">
          <Link href="/scan-history">
            <Button
              variant="outline"
              size="sm"
              
            >
              View All Scans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
