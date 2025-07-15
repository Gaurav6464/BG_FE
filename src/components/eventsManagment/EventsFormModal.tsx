import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar, MapPin, Globe, Clock, Users, FileText, X } from "lucide-react";

// Mock Event type for demonstration
interface Event {
  _id?: string;
  name: string;
  type: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  city?: string;
  isOnline: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Event>) => void;
  initialData?: Partial<Event> | null;
}

const EventFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Partial<Event>>();

  // Store original city value for toggling
  const [originalCity, setOriginalCity] = React.useState("");

  // Helper function to format datetime for datetime-local input
  const formatDateTimeForInput = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    
    // Handle both ISO format and your custom format
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "";
    
    // Format to YYYY-MM-DDTHH:MM (required for datetime-local)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /* preload */
  useEffect(() => {
    if (isOpen && initialData) {
      const formattedData = {
        ...initialData,
        startDateTime: formatDateTimeForInput(initialData.startDateTime || ""),
        endDateTime: formatDateTimeForInput(initialData.endDateTime || ""),
      };
      reset(formattedData);
      
      // Store original city value
      if (initialData.city) {
        setOriginalCity(initialData.city);
      }
    } else if (isOpen) {
      reset({});
      setOriginalCity("");
    }
  }, [isOpen, initialData, reset]);

  /* watch isOnline to disable / clear city */
  const isOnline = watch("isOnline", false);

  useEffect(() => {
    if (isOnline) {
      setValue("city", "");
    } else {
      // If switching back to offline and we have original city, restore it
      if (originalCity) {
        setValue("city", originalCity);
      }
    }
  }, [isOnline, setValue, originalCity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 sm:mx-0 animate-in fade-in-0 zoom-in-95 duration-200">
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
              {initialData?._id ? "Update Event" : "Create New Event"}
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in the details to {initialData?._id ? "update" : "create"} your event
            </p>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Event Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar size={16} className="text-blue-600" />
                Event Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Event name is required" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users size={16} className="text-purple-600" />
                Event Type
              </label>
              <select
                {...register("type", { required: "Event type is required" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select event type</option>
                <option value="conference">🎯 Conference</option>
                <option value="webinar">💻 Webinar</option>
                <option value="workshop">🔧 Workshop</option>
                <option value="meetup">🤝 Meet‑up</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.type.message as string}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={16} className="text-green-600" />
                Description
              </label>
              <textarea
                rows={4}
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="Tell us about your event..."
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock size={16} className="text-orange-600" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register("startDateTime", { required: "Start date is required" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.startDateTime && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.startDateTime.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock size={16} className="text-orange-600" />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register("endDateTime", { required: "End date is required" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.endDateTime && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.endDateTime.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Location</h3>
              
              {/* Online Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-600" />
                  <label htmlFor="isOnline" className="text-sm font-medium text-gray-700">
                    This is an online event
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${!isOnline ? 'text-gray-700' : 'text-gray-400'}`}>
                    No
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("isOnline")}
                      id="isOnline"
                      className="sr-only"
                    />
                    <div 
                      className={`w-11 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                        isOnline ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setValue("isOnline", !isOnline)}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                          isOnline ? 'translate-x-6' : 'translate-x-0.4'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${isOnline ? 'text-blue-600' : 'text-gray-400'}`}>
                    Yes
                  </span>
                </div>
              </div>

              {/* City Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin size={16} className="text-red-600" />
                  City
                </label>
                <input
                  type="text"
                  disabled={isOnline}
                  {...register("city", {
                    validate: (v) =>
                      isOnline || v?.trim()
                        ? true
                        : "City is required for offline events",
                  })}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isOnline
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  }`}
                  placeholder={isOnline ? "Not needed for online events" : "Enter city name"}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.city.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  reset({});
                  onClose();
                }}
                className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => {
                  onSubmit(data);
                  reset({});
                })}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {initialData?._id ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventFormModal;
