'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { File, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';  // <-- import Card components

const FileUpload = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setDragActive(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        const base64 = await convertToBase64(file);
        onFileUpload(file, base64);
      } catch (error) {
        toast.error('Failed to process the file');
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertToBase64(file);
        onFileUpload(file, base64);
      } catch (error) {
        toast.error('Failed to process the file');
        console.error('Error converting file to base64:', error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleButtonClick();
    }
  };

  return (
    <Card
      className="w-full mb-6 p-6 border border-gray-200 dark:border-gray-700"
      as="section"
      aria-label="File upload dropzone"
    >
      <CardContent
        tabIndex={0}
        role="button"
        aria-disabled={isLoading}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center w-full h-52
          border-2 border-dashed rounded-lg transition-all duration-300 outline-none
          ${
            dragActive
              ? 'border-blue-700 dark:border-blue-600 bg-blue-200 dark:bg-blue-900/70'
              : 'border-gray-300 dark:border-gray-600 bg-transparent'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 select-none pointer-events-none">
          <div
            className={`p-3 rounded-full bg-blue-600 dark:bg-blue-500 mb-3 ${
              isLoading ? 'animate-pulse' : ''
            }`}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supports all common file types (MAX. 64MB)
          </p>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading}
        />
      </CardContent>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleButtonClick}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center justify-center"
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white" />
              Analyzing...
            </>
          ) : (
            <>
              <File className="mr-2 h-4 w-4" /> Select File for Analysis
            </>
          )}
        </Button>
      </div>
      <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 select-none">
        Files are analyzed using our multi-engine security platform to detect potential threats
      </div>
    </Card>
  );
};

export default FileUpload;
