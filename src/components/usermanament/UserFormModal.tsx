import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { User } from "../../types/user.type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  initialData?: Partial<User> | null;
}

const UserFormModal: React.FC<Props> = ({
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
  } = useForm<Partial<User>>();

  useEffect(() => {
    if (isOpen) {
      reset(initialData || {});
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-4">
          {initialData?._id ? "Update User" : "Add User"}
        </h2>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            // reset inside modal in case of reuse
            reset({});
          })}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Required" })}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Required" })}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              {...register("role", { required: "Required" })}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isVerified")} />
              <span className="text-sm">Is Verified</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                reset({});
                onClose();
              }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              {initialData?._id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
