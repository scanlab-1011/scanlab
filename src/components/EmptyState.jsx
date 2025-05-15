'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors">
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
        <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">No Files Analyzed Yet</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Upload a file to start a comprehensive security analysis. Our system will check it against multiple security engines and provide detailed insights.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { step: 1, title: 'Upload File', desc: 'Drag & drop or select a file to scan' },
          { step: 2, title: 'Security Analysis', desc: 'Advanced multi-engine security checks' },
          { step: 3, title: 'Threat Assessment', desc: 'Get detailed security analysis and risk evaluation' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{step}</div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">{title}</h4>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
