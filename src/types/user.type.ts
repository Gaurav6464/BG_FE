// types/user.type.ts

export type  User = {
  createdAt: any;
  _id: any;
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  isVerified: boolean;
}


export type GetAllUsersParams = {
  searchTerm?: string;
  role?: string;
  status?: string;
  sortField?: keyof User;
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
};




export type userManagmentTableProps = {
  users: User[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortField: keyof User | "";
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
  onAction: (action:  "edit" | "delete", user: User) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setCurrentPage: (page: number) => void;
  getPaginationNumbers: () => (number | string)[];
}