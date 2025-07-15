import React, { useRef, useEffect, useCallback, useState } from "react";
import { Search, ChevronDown, ChevronUp, Edit2, Trash2, X } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import { debounce } from "lodash";
import type { Event } from "../../types/event.type";
import StatusWrapper from "../reuseable/StatusWrapper";
import { useCheckRoleAccess } from "../../hooks/useCheckRoleAccess";

type Props = {
  events: Event[];
  statusFilter: string;
  onStatusChange: (status: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  cityFilter: string;
  onCityChange: any;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isOnlineFilter: string;
  onIsOnlineChange: (status: string) => void;
  sortField: any;
  sortDirection: string;
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setCurrentPage: (val: number) => void;
  getPaginationNumbers: () => (number | string)[];
  isLoading: boolean;
  fetchEventError: any;
  onAction:any;
  eventFilters:any;
};

const statusTabs = ["upcoming", "ongoing", "completed"];

const EventManagementTable: React.FC<Props> = ({
  events,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  cityFilter,
  onCityChange,
  isOnlineFilter,
  onIsOnlineChange,
  searchTerm,
  setSearchTerm,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  getPaginationNumbers,
  isLoading,
  fetchEventError,
  onAction,
  eventFilters
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showOnlineDropdown, setShowOnlineDropdown] = useState(false);
  const {hasAccess , loading ,error} = useCheckRoleAccess()

  const typeRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const onlineRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce((val: string) => setSearchTerm(val), 500),
    [setSearchTerm] // Added setSearchTerm to dependencies
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]); // Added debouncedSearch to dependencies

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node))
        setShowTypeDropdown(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node))
        setShowCityDropdown(false);
      if (onlineRef.current && !onlineRef.current.contains(e.target as Node))
        setShowOnlineDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const renderCheck = (isSelected: boolean) =>
    isSelected ? (
      <svg
        className="w-4 h-4 text-indigo-600" // Changed color to indigo for consistency
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : null;

  return (
    <StatusWrapper loading={isLoading || loading} error={fetchEventError || error}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 font-inter antialiased">
        {/* Tabs for Status Filter */}
        <div className="flex gap-4 px-4 pt-4 border-b border-gray-100 overflow-x-auto whitespace-nowrap">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onStatusChange(tab)}
              className={`pb-3 border-b-2 text-sm font-medium capitalize transition-colors duration-200
                ${statusFilter === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by event name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
            {searchInput && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors duration-200"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                }}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Type Filter Dropdown */}
            <div className="relative" ref={typeRef}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                            ${typeFilter ? "bg-indigo-500 text-white border-indigo-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowCityDropdown(false);
                  setShowOnlineDropdown(false);
                }}
              >
                <FiFilter className={`${typeFilter ? "text-white" : "text-gray-500"}`} />
                <span>{typeFilter ? `Type: ${cap(typeFilter)}` : "Filter by Type"}</span>
                {showTypeDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showTypeDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-40 max-h-60 overflow-y-auto">
                  {["All", ...(eventFilters.types || [])].map((type) => (
                    <div
                      key={type}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                      onMouseDown={() => { // Use onMouseDown to prevent dropdown closing before click registers
                        onTypeChange(type === "All" ? "" : type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <span>{cap(type)}</span>
                      {type !== "All" && renderCheck(typeFilter === type)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* City Filter Dropdown */}
            <div className="relative" ref={cityRef}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                            ${cityFilter ? "bg-indigo-500 text-white border-indigo-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                onClick={() => {
                  setShowCityDropdown(!showCityDropdown);
                  setShowTypeDropdown(false);
                  setShowOnlineDropdown(false);
                }}
              >
                <FiFilter className={`${cityFilter ? "text-white" : "text-gray-500"}`} />
                <span>{cityFilter ? `City: ${cap(cityFilter)}` : "Filter by City"}</span>
                {showCityDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showCityDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-40 max-h-60 overflow-y-auto">
                  {["All", ...(eventFilters.cities || [])].map((city) => (
                    <div
                      key={city}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                      onMouseDown={() => {
                        onCityChange(city === "All" ? "" : city);
                        setShowCityDropdown(false);
                      }}
                    >
                      <span>{cap(city)}</span>
                      {city !== "All" && renderCheck(cityFilter === city)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Online Filter Dropdown */}
            <div className="relative" ref={onlineRef}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                            ${isOnlineFilter ? "bg-indigo-500 text-white border-indigo-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                onClick={() => {
                  setShowOnlineDropdown(!showOnlineDropdown);
                  setShowTypeDropdown(false);
                  setShowCityDropdown(false);
                }}
              >
                <FiFilter className={`${isOnlineFilter ? "text-white" : "text-gray-500"}`} />
                <span>{isOnlineFilter === "true" ? "Online" : isOnlineFilter === "false" ? "Offline" : "Filter by Online"}</span>
                {showOnlineDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showOnlineDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-40 max-h-60 overflow-y-auto">
                  {["All", "true", "false"].map((val) => (
                    <div
                      key={val}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                      onMouseDown={() => {
                        onIsOnlineChange(val === "All" ? "" : val);
                        setShowOnlineDropdown(false);
                      }}
                    >
                      <span>
                        {val === "All" ? "All" : val === "true" ? "Yes" : "No"}
                      </span>
                      {val !== "All" && renderCheck(isOnlineFilter === val)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(typeFilter || cityFilter || isOnlineFilter) && (
              <button
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center gap-1"
                onClick={() => {
                  onTypeChange("");
                  onCityChange("");
                  onIsOnlineChange("");
                }}
              >
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px] rounded-lg border border-gray-100">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <span>Type</span>
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <span>City</span>
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <span>Online</span>
                </th>

                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort("startDateTime")}
                >
                  <div className="flex items-center gap-1">
                    Start Date/Time
                    {sortField === "startDateTime" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort("endDateTime")}
                >
                  <div className="flex items-center gap-1">
                    End Date/Time
                    {sortField === "endDateTime" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>
                {hasAccess && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800">{event.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 capitalize">
                      {event.type}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800">{event.city}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${event.isOnline ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                        {event.isOnline ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(event.startDateTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(event.endDateTime).toLocaleString()}
                    </td>
                    {hasAccess && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            onClick={() => onAction("edit", event)}
                            title="Edit Event"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            onClick={() => onAction("delete", event)}
                            title="Delete Event"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={hasAccess ? 7 : 6} // Adjusted colspan based on hasAccess
                    className="text-center py-10 text-gray-500 text-base font-medium"
                  >
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>

            {getPaginationNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${page === currentPage
                    ? "bg-indigo-600 text-white shadow-md"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                  ${typeof page !== "number" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </StatusWrapper>
  );
};


export default EventManagementTable;
