import React, { useRef, useEffect, useCallback, useState } from "react";
import { Search, ChevronDown, ChevronUp, Edit2, Trash2, X } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import type { userManagmentTableProps } from "../../types/user.type"; // Keep original import
import { debounce } from "lodash"; 
import { useCheckRoleAccess } from "../../hooks/useCheckRoleAccess"; 
import StatusWrapper from "../reuseable/StatusWrapper"; // Keep original import






const UserManagementTable: React.FC<userManagmentTableProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
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
  const roleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);

  const hasFilter = selectedRole || selectedStatus;

  const { hasAccess, loading, error } = useCheckRoleAccess();

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setSearchTerm(val);
    }, 500),
    [setSearchTerm] // Added setSearchTerm to dependencies
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]); // Added debouncedSearch to dependencies

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <StatusWrapper loading={loading} error={error}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 font-inter antialiased">
        {/* Search and Filters Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            {/* Role Filter Dropdown */}
            <div className="relative" ref={roleRef}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                            ${selectedRole ? "bg-indigo-500 text-white border-indigo-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowStatusDropdown(false);
                }}
              >
                <FiFilter className={`${selectedRole ? "text-white" : "text-gray-500"}`} />
                <span>{selectedRole ? `Role: ${cap(selectedRole)}` : "Filter by Role"}</span>
                {showRoleDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showRoleDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-40 max-h-60 overflow-y-auto">
                  {["All", "admin", "user", "manager", "employee"].map(
                    (role) => (
                      <div
                        key={role}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                        onClick={() => {
                          setSelectedRole(role === "All" ? "" : role);
                          setShowRoleDropdown(false);
                        }}
                      >
                        <span>{cap(role)}</span>
                        {role !== "All" && renderCheck(selectedRole === role)}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative" ref={statusRef}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                            ${selectedStatus ? "bg-indigo-500 text-white border-indigo-500 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`}
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowRoleDropdown(false);
                }}
              >
                <FiFilter className={`${selectedStatus ? "text-white" : "text-gray-500"}`} />
                <span>{selectedStatus ? `Status: ${cap(selectedStatus)}` : "Filter by Status"}</span>
                {showStatusDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showStatusDropdown && (
                <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-40 max-h-60 overflow-y-auto">
                  {["All", "Active", "Inactive"].map((status) => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-800"
                      onClick={() => {
                        setSelectedStatus(
                          status === "All" ? "" : status
                        );
                        setShowStatusDropdown(false);
                      }}
                    >
                      <span>{cap(status)}</span>
                      {status !== "All" && renderCheck(selectedStatus === status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasFilter && (
              <button
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center gap-1"
                onClick={() => {
                  setSelectedRole("");
                  setSelectedStatus("");
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
                  onClick={() => onSort("fullName")}
                >
                  <div className="flex items-center gap-1">
                    Full Name{" "}
                    {sortField === "fullName" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email{" "}
                    {sortField === "email" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      ))}
                  </div>
                </th>

                {/* Role */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <span>Role</span>
                </th>

                {/* Status */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <span>Status</span>
                </th>
                {hasAccess && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800">{user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{cap(user.role)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.isVerified ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {hasAccess && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                            onClick={() => onAction("edit", user)}
                            title="Edit User"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            onClick={() => onAction("delete", user)}
                            title="Delete User"
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
                  <td colSpan={hasAccess ? 5 : 4}>
                    <div className="flex justify-center items-center py-16 text-gray-500 text-base font-medium">
                      No users found.
                    </div>
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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1); // Moved cap function here for general use

export default UserManagementTable;
