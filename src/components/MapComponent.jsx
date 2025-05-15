'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ latitude, longitude, city, country }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const L = (await import('leaflet')).default;

        if (!mapContainerRef.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
        }

        mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        const popupContent = `
          <div class="p-2">
            <div class="font-bold">${city || 'Unknown Location'}</div>
            <div>${country || ''}</div>
          </div>
        `;

        markerRef.current = L.marker([latitude, longitude])
          .addTo(mapRef.current)
          .bindPopup(popupContent)
          .openPopup();

        mapRef.current.invalidateSize();
      } catch (error) {
        console.error("Error loading map:", error);
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [latitude, longitude, city, country]);

  return (
    <Card className="h-[400px] w-full overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="h-full w-full" />
    </Card>
  );
};

export const MapSkeleton = () => (
  <Skeleton className="h-[400px] w-full" />
);

export default MapComponent;
