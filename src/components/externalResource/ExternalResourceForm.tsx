import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText, Link as LinkIcon, List, X } from "lucide-react";

type ResourceType = "apps" | "articles" | "audios" | "videos" | "books";

interface ExternalResource {
  _id?: string;
  name: string;
  link: string;
  type: ResourceType;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExternalResource) => void;
  initialData?: any;
}

const ExternalResourceFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExternalResource>();

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    } else if (isOpen) {
      reset({});
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 sm:mx-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-200 relative">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              {initialData?._id ? "Update Resource" : "Add New Resource"}
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in the details to {initialData?._id ? "update" : "create"} the external resource.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8 space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-blue-600" />
                Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                placeholder="Enter resource name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Link */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LinkIcon size={16} className="text-green-600" />
                Link
              </label>
              <input
                type="url"
                {...register("link", {
                  required: "Link is required",
                  pattern: {
                    value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                    message: "Enter a valid URL",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="text-red-500 text-sm">{errors.link.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <List size={16} className="text-purple-600" />
                Resource Type
              </label>
              <select
                {...register("type", { required: "Type is required" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
              >
                <option value="">Select type</option>
                <option value="app">📱 App</option>
                <option value="article">📰 Article</option>
                <option value="audio">🎧 Audio</option>
                <option value="video">🎥 Video</option>
                <option value="book">📚 Book</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => {
                  onSubmit({
                    ...data,
                    type: data.type.toLowerCase() as ResourceType, // enforce lowercase
                  });
                  reset();
                })}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
              >
                {initialData?._id ? "Update Resource" : "Add Resource"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalResourceFormModal;
