'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Clock, Shield, Navigation } from "lucide-react";

const IpDetailsCard = ({ ipDetails }) => {
  if (!ipDetails) return null;

  const {
    ip,
    latitude,
    longitude,
    city,
    country_name,
    region,
    postal,
    calling_code,
    emoji_flag,
    languages,
    currency,
    time_zone,
    threat,
    asn,
    company
  } = ipDetails;

  const renderLanguages = Array.isArray(languages) 
    ? languages.map(lang => `${lang.name}${lang.native ? ` (${lang.native})` : ''}`).join(', ') 
    : '';

  const renderCurrency = currency?.name || '';

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-secondary/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              IP: {ip}
            </CardTitle>
            {asn && (
              <CardDescription className="text-muted-foreground">
                {asn.asn} - {asn.name}
              </CardDescription>
            )}
          </div>
          {threat && (
            <Badge variant={threat.is_threat ? "destructive" : "secondary"} className="h-7 px-3">
              <Shield className="h-4 w-4 mr-1" />
              {threat.is_threat ? 'Threat Detected' : 'Safe'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {country_name && (
                <div className="col-span-2 flex items-center">
                  {emoji_flag && <span className="mr-2 text-xl">{emoji_flag}</span>}
                  <span>{country_name}{region ? `, ${region}` : ''}</span>
                </div>
              )}
              {city && <div>{city}</div>}
              {postal && <div>Postal: {postal}</div>}
              {latitude && longitude && (
                <div className="col-span-2 text-xs text-muted-foreground">
                  Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {(calling_code || languages || currency) && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Regional Info
              </h3>
              {calling_code && <div>Calling Code: +{calling_code}</div>}
              {languages && languages.length > 0 && <div>Languages: {renderLanguages}</div>}
              {currency && <div>Currency: {renderCurrency} {currency.symbol}</div>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {time_zone && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Time Zone
              </h3>
              {time_zone.name && <div>{time_zone.name}</div>}
              {time_zone.offset && (
                <div className="text-sm text-muted-foreground">
                  UTC Offset: {time_zone.offset}
                </div>
              )}
            </div>
          )}

          <Separator />

          {asn && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                Network
              </h3>
              <div>ASN: {asn.asn}</div>
              {asn.name && <div>{asn.name}</div>}
              {asn.domain && <div>Domain: {asn.domain}</div>}
              {asn.route && <div>Route: {asn.route}</div>}
              {asn.type && <div>Type: {asn.type}</div>}
              {company && company.name && company.name !== asn.name && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Company: {company.name}</div>
                  {company.domain && <div className="text-xs">{company.domain}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IpDetailsCard;
