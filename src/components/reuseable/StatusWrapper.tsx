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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <span className="text-gray-800 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-red-600">
        <p className="text-center mb-2">
          Something went wrong: {error.message || "Unknown error"}
        </p>
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
