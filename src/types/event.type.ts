

export type GetAllEventsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortField?: any;
  sortDirection?: "asc" | "desc";
  city?: string;
  type?: string;
  isOnline?: boolean;
  status?: string;
};

export type Event = {
  _id?: string;
  name: string;
  type: string;
  description: string;
  startDateTime?: any;
  endDateTime?: any;
  city?: string;
  isOnline?: boolean;
  status?: any;
  createdAt?: Date;
  updatedAt?: Date;
};
