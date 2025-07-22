import React, { useEffect, useState, useCallback, useRef } from "react";

import { debounce } from "lodash";

import { FiFilter } from "react-icons/fi";

import type { Event } from "../../types/event.type";

import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";

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

  onAction: any;

  eventFilters: any;
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

  eventFilters,
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [showOnlineDropdown, setShowOnlineDropdown] = useState(false);

  const { hasAccess, loading, error } = useCheckRoleAccess();

  const typeRef = useRef(null);

  const cityRef = useRef(null);

  const onlineRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce((val: string) => setSearchTerm(val), 500),

    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !(typeRef.current as any).contains(e.target))
        setShowTypeDropdown(false);

      if (cityRef.current && !(cityRef.current as any).contains(e.target))
        setShowCityDropdown(false);

      if (onlineRef.current && !(onlineRef.current as any).contains(e.target))
        setShowOnlineDropdown(false);
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const renderCheck = (isSelected: boolean) =>
    isSelected ? (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : null;

  return (
    <StatusWrapper
      loading={isLoading || loading}
      error={fetchEventError || error}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}

        <div className="flex gap-6 px-4 pt-4 border-b">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onStatusChange(tab)}
              className={`pb-2 border-b-2 text-sm font-medium capitalize ${
                statusFilter === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer"
                  onClick={() => onSort("name")}
                >
                  <div className="flex">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase relative">
                  <div className="flex items-center gap-1" ref={typeRef}>
                    <span>Type</span>

                    <FiFilter
                      className={`cursor-pointer ${
                        typeFilter ? "text-blue-600" : "text-gray-500"
                      }`}
                      onClick={() => {
                        setShowTypeDropdown(!showTypeDropdown);

                        setShowCityDropdown(false);

                        setShowOnlineDropdown(false);
                      }}
                    />
                  </div>

                  {showTypeDropdown && (
                    <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-32">
                      {["All", ...eventFilters.types].map((type) => (
                        <div
                          key={type}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          onMouseDown={() => {
                            onTypeChange(type === "All" ? "" : type);

                            setShowTypeDropdown(false);
                          }}
                        >
                          <span>{type}</span>

                          {type !== "All" && renderCheck(typeFilter === type)}
                        </div>
                      ))}
                    </div>
                  )}
                </th>

                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase relative">
                  <div className="flex items-center gap-1" ref={cityRef}>
                    <span>City</span>

                    <FiFilter
                      className={`cursor-pointer ${
                        cityFilter ? "text-blue-600" : "text-gray-500"
                      }`}
                      onClick={() => {
                        setShowCityDropdown(!showCityDropdown);

                        setShowTypeDropdown(false);

                        setShowOnlineDropdown(false);
                      }}
                    />
                  </div>

                  {showCityDropdown && (
                    <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-32">
                      {["All", ...eventFilters.cities].map((city) => (
                        <div
                          key={city}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          onMouseDown={() => {
                            onCityChange(city === "All" ? "" : city);

                            setShowCityDropdown(false);
                          }}
                        >
                          <span>{city}</span>

                          {city !== "All" && renderCheck(cityFilter === city)}
                        </div>
                      ))}
                    </div>
                  )}
                </th>

                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase relative">
                  <div className="flex items-center gap-1" ref={onlineRef}>
                    <span>Online</span>

                    <FiFilter
                      className={`cursor-pointer ${
                        isOnlineFilter ? "text-blue-600" : "text-gray-500"
                      }`}
                      onClick={() => {
                        setShowOnlineDropdown(!showOnlineDropdown);

                        setShowTypeDropdown(false);

                        setShowCityDropdown(false);
                      }}
                    />
                  </div>

                  {showOnlineDropdown && (
                    <div className="absolute z-10 mt-1 bg-white border rounded shadow text-sm w-32">
                      {["All", ...eventFilters.isOnline].map((val) => (
                        <div
                          key={val}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          onMouseDown={() => {
                            onIsOnlineChange(val === "All" ? "" : val);

                            setShowOnlineDropdown(false);
                          }}
                        >
                          <span>
                            {val === "All"
                              ? "All"
                              : val == "true"
                              ? "Yes"
                              : "No"}
                          </span>

                          {val !== "All" && renderCheck(isOnlineFilter === val)}
                        </div>
                      ))}
                    </div>
                  )}
                </th>

                <th
                  className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer "
                  onClick={() => onSort("startDateTime")}
                >
                  <div className="flex">
                    Start DateTime
                    {sortField === "startDateTime" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>

                <th
                  className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer flex"
                  onClick={() => onSort("endDateTime")}
                >
                  <div className="flex">
                    End DateTime
                    {sortField === "endDateTime" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>

                {hasAccess && (
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{event.name}</td>

                    <td className="px-4 py-2 text-sm capitalize">
                      {event.type}
                    </td>

                    <td className="px-4 py-2 text-sm">{event.city}</td>

                    <td className="px-4 py-2 text-sm">
                      {event.isOnline ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {new Date(event.startDateTime).toLocaleString()}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {new Date(event.endDateTime).toLocaleString()}
                    </td>

                    {hasAccess && (
                      <td className="px-4 py-2 text-sm">
                        <div className="flex gap-2">
                          <Edit2
                            className="text-green-500 cursor-pointer w-4 h-4"
                            onClick={() => onAction("edit", event)}
                          />

                          <Trash2
                            className="text-red-500 cursor-pointer w-4 h-4"
                            onClick={() => onAction("delete", event)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-sm text-gray-400"
                  >
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {getPaginationNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
                className={`px-3 py-1 text-sm border rounded ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
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
