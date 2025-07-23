import React, { useState } from "react";
import ExternalResourceTable from "../../components/externalResource/ExternalResourceTable";
import ExternalResourceFormModal from "../../components/externalResource/ExternalResourceForm";
import DeleteConfirmation from "../../components/reuseable/DeleteConfirmation";
import ExternalResourceService from "../../api/externalResource";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExternalResource, GetAllExternalResourcesParams } from "../../types/externalResource.type";
import StatusWrapper from "../../components/reuseable/StatusWrapper";
import { toast } from "react-toastify";

const ExternalResourceManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortField, setSortField] = useState<keyof ExternalResource>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<Partial<ExternalResource> | null>(null);
  const [deleteResource, setDeleteResource] = useState<ExternalResource | null>(null);

  const queryClient = useQueryClient();

  const queryParams: GetAllExternalResourcesParams = {
    searchTerm,
    type: selectedType || undefined,
    sortField,
    sortDirection,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["external-resources", queryParams],
    queryFn: () => ExternalResourceService.getAll(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const addOrUpdateResource = useMutation({
    mutationFn: async (resource: Partial<ExternalResource>) => {
      if (editResource?._id) {
        return await ExternalResourceService.update(editResource._id, resource);
      } else {
        return await ExternalResourceService.add(resource as ExternalResource);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["external-resources"] });
      toast.success(res.message || (editResource ? "Resource updated" : "Resource added"));
      setEditResource(null);
      setFormOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.message || "Error occurred");
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => await ExternalResourceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-resources"] });
      setDeleteResource(null);
      toast.success("Resource deleted successfully");
    },
  });

  const handleSort = (field: keyof ExternalResource) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAction = (action: "edit" | "delete", resource: ExternalResource) => {
    if (action === "edit") {
      setEditResource(resource);
      setFormOpen(true);
    } else {
      setDeleteResource(resource);
    }
  };

  const getPaginationNumbers = (): (number | string)[] => {
    const totalPages  :number = data?.totalPages;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const onClose = () => {
    setFormOpen(false);
    setEditResource(null);
  };

  return (
    <StatusWrapper loading={false} error={null}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">External Resources</h1>
          <button
            onClick={() => {
              setFormOpen(true);
              setEditResource(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Resource
          </button>
        </div>

        {isError && <div className="text-red-500 mb-2">Failed to load resources.</div>}

        <ExternalResourceTable
          resources={isLoading ? [] : data?.data || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
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

        <ExternalResourceFormModal
          key={formOpen ? editResource?._id ?? "new" : "closed"}
          isOpen={formOpen}
          onClose={onClose}
          onSubmit={(data) => addOrUpdateResource.mutate(data)}
          initialData={editResource}
        />

        <DeleteConfirmation
          isOpen={!!deleteResource}
          onClose={() => setDeleteResource(null)}
          onConfirm={() => deleteResourceMutation.mutate(deleteResource!._id)}
          deleteTitle={"Are you sure to delete this resource?"}
        />
      </div>
    </StatusWrapper>
  );
};

export default ExternalResourceManagementPage;
