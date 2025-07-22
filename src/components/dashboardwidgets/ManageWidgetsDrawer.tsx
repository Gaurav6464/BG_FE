import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useWidgets } from "../../hooks/useGetWidGets";
import type {
  ManageWidgetsDrawerProps,
  WidgetItem,
} from "../../types/Wideget.type";
import SortableWidget from "./SortableWidget";
import widGetService from "../../api/widget";
import { useMutation } from "@tanstack/react-query";
import StatusWrapper from "../reuseable/StatusWrapper";
import { toast } from "react-toastify";

const ManageWidgetsDrawer: React.FC<ManageWidgetsDrawerProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { widgetData, refetch } = useWidgets();
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);

  useEffect(() => {
    if (widgetData?.widgets) {
      const sorted = [...widgetData.widgets].sort((a, b) => a.order - b.order);
      setWidgets(sorted);
    }
  }, [widgetData]);
  const toggleVisibility = (key: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.key === key ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = widgets.findIndex((w) => w.key === active.id);
    const newIndex = widgets.findIndex((w) => w.key === over.id);
    const reordered = arrayMove(widgets, oldIndex, newIndex).map(
      (widget, index) => ({
        ...widget,
        order: index,
      })
    );
    setWidgets(reordered);
  };
  const {
    mutate: handleUpdate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (widgets: any[]) => widGetService.addOrUpdate({ widgets }),
    onSuccess: (data) => {
      console.log("Widgets updated successfully:", data);
      toast.success("Widgets updated successfully");
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update widgets:", error);
      toast.error("Failed to update widgets");
    },
  });
  return (
    <>
      <StatusWrapper error={error} loading={isPending}>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Manage Widgets</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={widgets.map((w) => w.key)}
                strategy={verticalListSortingStrategy}
              >
                {widgets.map((widget) => (
                  <SortableWidget
                    key={widget.key}
                    widget={widget}
                    toggleVisibility={toggleVisibility}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleUpdate(widgets);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </StatusWrapper>
    </>
  );
};

export default ManageWidgetsDrawer;
