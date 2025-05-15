import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const EngineResults = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleResults, setVisibleResults] = useState(5); // Initially show 5 results
  const [showMoreLoading, setShowMoreLoading] = useState(false); // Loading state for smoothness

  const filteredResults = results
    .filter(result =>
      result.engine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.result.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleResults); // Slice results to the number of visible results

  const getResultIcon = (result) => {
    switch (result.toLowerCase()) {
      case 'malicious':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'suspicious':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'clean':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'timeout':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'undetected':
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultClass = (result) => {
    switch (result.toLowerCase()) {
      case 'malicious':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'suspicious':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'clean':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'timeout':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'undetected':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const isDangerous = (result) => {
    return result.toLowerCase() === 'malicious' || result.toLowerCase() === 'suspicious';
  };

  const handleShowMore = () => {
    setShowMoreLoading(true);
    setTimeout(() => {
      setVisibleResults(prev => prev + 10); // Increase the visible results by 5 each time
      setShowMoreLoading(false); // Reset loading state after transition
    }, 300); // Delay to match the fade-in effect duration
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-medium">Detection Engine Results</CardTitle>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search engines or results..."
            className="pl-8 py-1 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Engine Name</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                    No results match your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result, index) => (
                  <TableRow
                    key={index}
                    className={`transition-opacity duration-300 ${
                      showMoreLoading ? 'opacity-0' : 'opacity-100'
                    } ${isDangerous(result.result) ? 'bg-red-100' : ''}`} // Highlight dangerous results
                  >
                    <TableCell className="font-medium">{result.engine_name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getResultClass(result.result)}`}>
                        {getResultIcon(result.result)}
                        {result.result}
                        {isDangerous(result.result) && (
                          <span className="text-red-600 ml-2 font-bold text-sm">Priority</span>
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {filteredResults.length < results.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleShowMore}
              className="text-blue-500 hover:underline"
            >
              {showMoreLoading ? 'Loading...' : 'Show More'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngineResults;
