import React from "react";

type StatusWrapperProps = {
  loading: boolean;
  error: any;
  children: React.ReactNode;
  onRetry?: () => void;
};

const StatusWrapper: React.FC<StatusWrapperProps> = ({ loading, error, children, onRetry }) => {
  if (loading) {
    return (
<div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
  <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-black border-t-transparent"></div>
  <span className="text-sm text-gray-700">Loading...</span>
</div>

    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-red-600">
        <p className="text-center mb-2">Something went wrong: {error.message || "Unknown error"}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusWrapper;
