'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const IpForm = ({ onSearch, loading }) => {
  const [ip, setIp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ip.trim()) {
      onSearch(ip.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !ip.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition duration-300"
            >
              {loading ? (
                <span className="animate-pulse">Searching...</span>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IpForm;
