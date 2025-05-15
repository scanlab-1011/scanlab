import { cn } from "@/lib/utils";

const StatusBadge = ({ status, className, children }) => {
  const statusStyles = {
    safe: "bg-green-100 text-green-700 border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    danger: "bg-red-100 text-red-700 border-red-300",
    scanning: "bg-blue-100 text-blue-700 border-blue-300 animate-pulse",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
