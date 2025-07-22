import { Eye, EyeOff, Menu } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetItem } from "../../types/Wideget.type";
import { useSortable } from "@dnd-kit/sortable";
const SortableWidget = ({
  widget,
  toggleVisibility,
}: {
  widget: WidgetItem;
  toggleVisibility: (key: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: widget.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded-md px-4 py-2 hover:bg-gray-50 transition bg-white"
    >
      <div className="flex items-center gap-2 text-gray-700">
        {/* Only this is draggable */}
        <span className="cursor-grab" {...attributes} {...listeners}>
          <Menu className="w-4 h-4" />
        </span>
        <span className="font-medium capitalize">{widget.key}</span>
      </div>
      <button onClick={() => toggleVisibility(widget.key)}>
        {widget.visible ? (
          <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-400 hover:text-blue-600" />
        )}
      </button>
    </div>
  );
};

export default SortableWidget ;