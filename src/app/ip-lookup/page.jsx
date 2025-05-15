'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IpForm from "@/components/IpForm";
import IpDetailsCard from "@/components/IpDetailsCard";
import MapComponent, { MapSkeleton } from "@/components/MapComponent";
import { Globe, MapPin, Info } from "lucide-react";

const HomePage = () => {
  const [ipDetails, setIpDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (ip) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ip-details?ip=${ip}`);
      const data = await response.json();

      if (response.ok) {
        setIpDetails(data);
      } else {
        alert(data.error || "Failed to retrieve IP information. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to retrieve IP information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      <header className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold text-primary mb-2">IP Lookup</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get detailed information about any IP address including location, network details, and more.
        </p>
      </header>

      <div className="w-full max-w-5xl mx-auto space-y-6 flex-1">
        <Card className="p-6 shadow-lg bg-secondary/30">
          <IpForm onSearch={handleSearch} loading={loading} />
        </Card>

        {loading ? (
          <div className="space-y-4">
            <Card className="p-6 animate-pulse bg-secondary/20 h-64" />
            <MapSkeleton />
          </div>
        ) : ipDetails ? (
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="details">
                <Info className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapPin className="mr-2 h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <IpDetailsCard ipDetails={ipDetails} />
            </TabsContent>

            <TabsContent value="map">
              {ipDetails.latitude && ipDetails.longitude ? (
                <MapComponent
                  latitude={ipDetails.latitude}
                  longitude={ipDetails.longitude}
                  city={ipDetails.city || undefined}
                  country={ipDetails.country_name}
                />
              ) : (
                <Card className="p-6 text-center">
                  <p className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    No location data available for this IP address
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="p-10 text-center bg-secondary/10 border border-dashed">
            <Globe className="h-16 w-16 mx-auto mb-4 text-primary/60" />
            <h3 className="text-xl font-medium mb-2">Enter an IP Address</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Search for any IP address to view detailed geographic and network information.
            </p>
          </Card>
        )}
      </div>

    </div>
  );
};

export default HomePage;
