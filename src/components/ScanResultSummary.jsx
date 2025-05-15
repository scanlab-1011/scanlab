import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ScanResultSummary = ({ stats }) => {
  const totalScans = stats.malicious + stats.suspicious + stats.undetected + stats.harmless + stats.timeout;
  const threatPercentage = ((stats.malicious + stats.suspicious) / totalScans * 100).toFixed(1);
  
  let threatLevel = "Safe";
  let threatColor = "bg-green-100 text-green-800";
  
  if (stats.malicious > 0) {
    threatLevel = stats.malicious > 3 ? "High Risk" : "Moderate Risk";
    threatColor = stats.malicious > 3 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
  } else if (stats.suspicious > 0) {
    threatLevel = stats.suspicious > 5 ? "Suspicious" : "Low Risk";
    threatColor = stats.suspicious > 5 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800";
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Scan Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Threat Assessment</p>
            <p className="text-2xl font-semibold">{threatLevel}</p>
          </div>
          <Badge className={`text-sm py-1 px-3 ${threatColor}`}>
            {threatPercentage}% Threat Score
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          <StatBox label="Malicious" value={stats.malicious} color="bg-red-50 text-red-700" />
          <StatBox label="Suspicious" value={stats.suspicious} color="bg-amber-50 text-amber-700" />
          <StatBox label="Undetected" value={stats.undetected} color="bg-blue-50 text-blue-700" />
          <StatBox label="Harmless" value={stats.harmless} color="bg-green-50 text-green-700" />
          <StatBox label="Timeout" value={stats.timeout} color="bg-gray-50 text-gray-700" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 text-sm text-muted-foreground">
        <p>Total engines: {totalScans}</p>
      </CardFooter>
    </Card>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className={`rounded-md p-2 ${color}`}>
    <p className="font-medium">{value}</p>
    <p className="text-xs">{label}</p>
  </div>
);

export default ScanResultSummary;
