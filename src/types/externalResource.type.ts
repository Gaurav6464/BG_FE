export type ExternalResource = {
  _id: string;
  name: string;
  link: string;
  type: 'apps' | 'articles' | 'audios' | 'videos' | 'books';
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type GetAllExternalResourcesParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?:any;
  searchTerm?:string;
  sortField?:string;
  sortDirection?:string;
  totalPages?:any;
}


export type ExternalResourceProps = {
  resources: ExternalResource[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: any;
  onAction: (action: "edit" | "delete", resource: ExternalResource) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setCurrentPage: (val: number) => void;
  getPaginationNumbers: () => (number | string)[];
};
