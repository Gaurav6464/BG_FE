import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteTitle:string;
}

const DeleteConfirmation: React.FC<Props> = ({ isOpen, onClose, onConfirm ,deleteTitle}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
        <p className="text-sm text-gray-700">{deleteTitle}</p>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
