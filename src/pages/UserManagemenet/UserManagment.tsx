import React, { useState } from "react";
import UserManagementTable from "../../components/usermanament/usermanagment";
import UserFormModal from "../../components/usermanament/UserFormModal";
import DeleteConfirmation from "../../components/reuseable/DeleteConfirmation";
import UserService from "../../api/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetAllUsersParams, User } from "../../types/user.type";
import { useCheckRoleAccess } from "../../hooks/useCheckRoleAccess";
import StatusWrapper from "../../components/reuseable/StatusWrapper";
import { toast } from "react-toastify";

const UserManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState<keyof User>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<Partial<User> | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const { hasAccess, loading, error } = useCheckRoleAccess();

  const queryClient = useQueryClient();

  const queryParams: GetAllUsersParams = {
    searchTerm,
    role: selectedRole || undefined,
    status: selectedStatus || undefined,
    sortField,
    sortDirection,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => UserService.getAll(queryParams),
     placeholderData: (previousData) => previousData, // 👈 prevent flicker
  });

  const addOrUpdateUser = useMutation({
    mutationFn: async (user: Partial<User>) => {
      if (editUser?._id) {
        return await UserService.update(editUser._id, user);
      } else {
        return await UserService.add(user as User);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        editUser
          ? res.message || "Update User successfully"
          : res.message || "Add User successfully"
      );

      setEditUser(null);
      setFormOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.message || "Error occurred");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => await UserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteUser(null);
      toast.success("user delete successfully");
    },
  });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAction = (action: "edit" | "delete", user: User) => {
    if (action === "edit") {
      setEditUser(user);
      setFormOpen(true);
    } else {
      setDeleteUser(user);
    }
  };

  const getPaginationNumbers = (): (number | string)[] => {
    const totalCount: number = data?.total || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const onClose = () => {
    setFormOpen(false);
    setEditUser(null);
  };

  return (
    <StatusWrapper error={error} loading={loading}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">User Management</h1>
          {hasAccess && (
            <button
              onClick={() => {
                setFormOpen(true);
                setEditUser(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
          )}
        </div>

        {isError && (
          <div className="text-red-500 mb-2">Failed to load users.</div>
        )}
        <UserManagementTable
          users={isLoading ? [] : data?.data || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onAction={handleAction}
          currentPage={currentPage}
          totalPages={Math.ceil((data?.total || 0) / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          getPaginationNumbers={getPaginationNumbers}
        />

        {/* Modals */}
        <UserFormModal
          // Use key to force remount and fully reset form
          key={formOpen ? editUser?._id ?? "new" : "closed"}
          isOpen={formOpen}
          onClose={onClose}
          onSubmit={(data) => addOrUpdateUser.mutate(data)}
          initialData={editUser}
        />

        <DeleteConfirmation
          isOpen={!!deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={() => deleteUserMutation.mutate(deleteUser!._id)}
          deleteTitle={"Are you sure to delete this user?"}
        />
      </div>
    </StatusWrapper>
  );
};

export default UserManagementPage;
