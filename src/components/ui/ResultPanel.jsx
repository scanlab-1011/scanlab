import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';

const EngineResults = ({ results = {} }) => {
  const getStatusStyle = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'clean':
        return {
          icon: <FaCheckCircle className="text-green-600" />,
          text: 'clean',
          badge: 'bg-green-100 text-green-600'
        };
      case 'unrated':
        return {
          icon: <FaQuestionCircle className="text-gray-600" />,
          text: 'unrated',
          badge: 'bg-gray-100 text-gray-600'
        };
      case 'malicious':
      case 'phishing':
        return {
          icon: <FaTimesCircle className="text-red-600" />,
          text: 'malicious',
          badge: 'bg-red-100 text-red-600'
        };
      default:
        return {
          icon: <FaExclamationCircle className="text-yellow-700" />,
          text: 'suspicious',
          badge: 'bg-yellow-100 text-yellow-700'
        };
    }
  };

  const engines = Object.entries(results);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Detection Engine Results</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-sm font-medium border-b">Engine</th>
              <th className="px-6 py-3 text-sm font-medium border-b">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {engines.length > 0 ? (
              engines.map(([engine, verdict]) => {
                const { icon, badge } = getStatusStyle(verdict);
                return (
                  <tr key={engine} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{engine}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
                      >
                        {icon}
                        <span>{verdict}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No results available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EngineResults;
