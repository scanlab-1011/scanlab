import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-4",
  lg: "h-8 w-8 border-4",
};

const LoadingSpinner = ({
  size = "md",
  className = "",
  color = "border-indigo-500",  // Default color set to indigo
}) => {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-t-4 animate-spin-slow border-solid",
        sizeClasses[size],
        color,
        className
      )}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
