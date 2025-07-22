import { useEffect, useState, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EventManagementTable from "../../components/eventsManagment/EventsTable";
import eventService from "../../api/events";
import StatusWrapper from "../../components/reuseable/StatusWrapper";
import { useCheckRoleAccess } from "../../hooks/useCheckRoleAccess";
import EventFormModal from "../../components/eventsManagment/EventsFormModal";
import type { Event } from "../../types/event.type";
import DeleteConfirmation from "../../components/reuseable/DeleteConfirmation";
import { toast } from "react-toastify";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [typeFilter, setTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [isOnlineFilter, setIsOnlineFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
  const { hasAccess, loading, error: roleError } = useCheckRoleAccess();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "events",
      searchTerm,
      statusFilter,
      typeFilter,
      cityFilter,
      isOnlineFilter,
      sortField,
      sortDirection,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () =>
      eventService.getAll({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm,
        sortField,
        sortDirection,
        status: statusFilter,
        type: typeFilter,
        city: cityFilter,
        isOnline: isOnlineFilter === "" ? undefined : isOnlineFilter === "true",
      }),
       placeholderData: (previousData) => previousData, // 👈 prevent flicker
  });

  const getPaginationNumbers = () => {
    const totalPages = data?.totalPages || 1;
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const {
    data: filterData,
    isLoading: filterLoading,
    error: filterError,
  } = useQuery({
    queryKey: ["filters", "events", statusFilter],
    queryFn: () => eventService.getAllFilters(statusFilter),
  });

  const onClose = () => {
    setFormOpen(false);
    setEditEvent(null);
  };
  const addOrUpdateUser = useMutation({
    mutationFn: async (event: Partial<Event>) => {
      if (editEvent?._id) {
        return await eventService.update(editEvent._id, event);
      } else {
        return await eventService.add(event as Event);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      console.log(res.message);
      toast.success(
        editEvent
          ? res.message || "Event updated successfully"
          : res.message || "Event added successfully"
      );

      setEditEvent(null);
      setFormOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.message || "Error occurred");
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (id: any) => await eventService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setDeleteEvent(null);
      toast.success("Event delete successfully");
    },
  });

  const handleAction = (action: "edit" | "delete", event: Event) => {
    if (action === "edit") {
      setEditEvent(event);
      setFormOpen(true);
    } else {
      setDeleteEvent(event);
    }
  };

  useEffect(() => {
    setCityFilter("");
    setIsOnlineFilter("");
    setTypeFilter("");
    setSearchTerm("");
  }, [statusFilter]);

  return (
    <StatusWrapper
      error={filterError || error || roleError}
      loading={filterLoading || loading || isLoading}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Event Management</h1>
          {hasAccess && (
            <button
              onClick={() => {
                setFormOpen(true);
                setEditEvent(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Event
            </button>
          )}
        </div>
        <EventManagementTable
          events={data?.events || []}
          isLoading={isLoading}
          fetchEventError={error}
          statusFilter={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          typeFilter={typeFilter}
          onTypeChange={(val) => {
            setTypeFilter(val);
            setCurrentPage(1);
          }}
          cityFilter={cityFilter}
          onCityChange={(val: SetStateAction<string>) => {
            setCityFilter(val);
            setCurrentPage(1);
          }}
          isOnlineFilter={isOnlineFilter}
          onIsOnlineChange={(val) => {
            console.log(val);
            setIsOnlineFilter(val);
            setCurrentPage(1);
          }}
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={(field) => {
            if (field === sortField) {
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
              setSortField(field as keyof Event);
              setSortDirection("asc");
            }
          }}
          currentPage={currentPage}
          totalPages={data?.totalPages || 1}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
          setCurrentPage={setCurrentPage}
          getPaginationNumbers={getPaginationNumbers}
          onAction={handleAction}
          eventFilters={filterData?.filters || []}
        />
      </div>

      <EventFormModal
        isOpen={formOpen}
        onClose={onClose}
        initialData={editEvent}
        onSubmit={(data) => addOrUpdateUser.mutate(data)}
      />

      <DeleteConfirmation
        isOpen={!!deleteEvent}
        onClose={() => setDeleteEvent(null)}
        onConfirm={() => deleteUserMutation.mutate(deleteEvent?._id)}
        deleteTitle={"Are you sure to delete this user?"}
      />
    </StatusWrapper>
  );
};

export default Events;
