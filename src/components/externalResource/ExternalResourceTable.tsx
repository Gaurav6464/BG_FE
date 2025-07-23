import React, { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Video,
  Headphones,
  BookOpen,
  Smartphone,
} from "lucide-react";
import { FiFilter } from "react-icons/fi";
import StatusWrapper from "../reuseable/StatusWrapper";
import _ from "lodash";
import type { ExternalResourceProps } from "../../types/externalResource.type";

const resourceTypes = ["All", "Article", "App", "Video", "Book", "Audio"];

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "article":
      return <FileText className="w-4 h-4 text-blue-600" />;
    case "app":
      return <Smartphone className="w-4 h-4 text-green-600" />;
    case "video":
      return <Video className="w-4 h-4 text-red-600" />;
    case "book":
      return <BookOpen className="w-4 h-4 text-purple-600" />;
    case "audio":
      return <Headphones className="w-4 h-4 text-orange-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

const getTypeEmoji = (type: string) => {
  switch (type.toLowerCase()) {
    case "article":
      return "📄";
    case "app":
      return "📱";
    case "video":
      return "🎥";
    case "book":
      return "📚";
    case "audio":
      return "🎧";
    default:
      return "📄";
  }
};

const ExternalResourceTable: React.FC<ExternalResourceProps> = ({
  resources,
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  sortField,
  sortDirection,
  onSort,
  onAction,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  getPaginationNumbers,
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setSearchTerm(val);
    }, 500),
    [setSearchTerm]
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <StatusWrapper loading={false} error={null}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-inter antialiased">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="relative w-full sm:w-1/2 lg:w-2/5">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400 bg-white shadow-sm transition-all duration-200"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative" ref={typeRef}>
              <button
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 font-medium shadow-sm
                  ${
                    selectedType !== "All"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-500 shadow-lg transform scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md"
                  }`}
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <FiFilter
                  className={`${
                    selectedType !== "All" ? "text-white" : "text-gray-500"
                  }`}
                />
                <span>
                  {selectedType !== "All"
                    ? `${getTypeEmoji(selectedType)} ${selectedType}`
                    : "🔍 Filter by Type"}
                </span>
                {showTypeDropdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showTypeDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl text-sm w-48 max-h-64 overflow-y-auto">
                  {resourceTypes.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-gray-800 transition-colors duration-150 flex items-center gap-3"
                      onClick={() => {
                        setSelectedType(type === "All" ? "" : type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <span className="text-lg">
                        {type === "All" ? "🔍" : getTypeEmoji(type)}
                      </span>
                      <span className="font-medium">{type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-150"
                  onClick={() => onSort("name")}
                >
                  <div className="flex items-center gap-2">
                    📝 Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>

                <th
                  onClick={() => onSort("type")}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-200 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2">
                    🏷️ Type
                    {sortField === "type" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>

                <th className=" px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-200 transition-colors duration-150">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Created By
                  </div>
                </th>

                <th
                  onClick={() => onSort("createdAt")}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-200 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created On
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  🔗 Link
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  ⚡ Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {resources.length > 0 ? (
                resources.map((res, index) => (
                  <tr
                    key={res._id}
                    className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-gray-25" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                        {res.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(res.type)}
                        <span className="font-medium">
                          {_.capitalize(res.type)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {res.createdBy.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">
                          {res.createdBy.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {formatDate(res.createdAt)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200 group"
                        title={res.link}
                      >
                        🌐 <span>{truncateUrl(res.link)}</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                          onClick={() => onAction("edit", res)}
                          title="Edit Resource"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                          onClick={() => onAction("delete", res)}
                          title="Delete Resource"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col justify-center items-center py-16 text-gray-500">
                      <div className="text-6xl mb-4">📂</div>
                      <div className="text-lg font-medium mb-2">
                        No external resources found
                      </div>
                      <div className="text-sm">
                        Try adjusting your search or filters
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span className="font-medium">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                ← Previous
              </button>

              {getPaginationNumbers().map((page, i) => (
                <button
                  key={i}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={typeof page !== "number"}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                    page === currentPage
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                      : "border border-gray-300 text-gray-700 hover:bg-white hover:shadow-md"
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
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </StatusWrapper>
  );
};

export default ExternalResourceTable;
