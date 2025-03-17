import {
  useContext,
  useEffect,
  useState,
} from "react";
import { Select, message } from "antd";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppContext } from "../context/AppContext";
import { AREAS } from "../assets/areas";

const { Option } = Select;

const DraggableSelect = ({ setAreas }: any) => {
  const context = useContext(AppContext);
  const partner = context?.partner;
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const areas = AREAS;

  useEffect(() => {
    const areas = partner?.areas ?? [];
    setSelectedAreas(areas);
    setAreas(selectedAreas);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleSelect = (value: string) => {
    if (!selectedAreas.includes(value)) {
      setSelectedAreas((prev) => {
        const updatedAreas = [...prev, value];
        setAreas(updatedAreas);
        return updatedAreas;
      });
    }
  };

  const handleDeselect = (value: string) => {
    setSelectedAreas((prev) => {
      const updatedAreas = prev.filter((area) => area !== value);
      setAreas(updatedAreas);
      return updatedAreas;
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedAreas((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const newOrder = arrayMove(prev, oldIndex, newIndex);

        setAreas(newOrder);
        message.success("Order updated");
        return newOrder;
      });
    }
  };

  return (
    <div style={{ padding: "16px", minWidth: "200px", maxWidth: "400px", margin: "auto" }}>
      {/* Select Component */}
      <Select
        mode="multiple"
        value={selectedAreas}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        style={{ width: "100%" }}
        placeholder="Select areas"
      >
        {areas.map((area) => (
          <Option key={area} value={area}>
            {area}
          </Option>
        ))}
      </Select>

      {/* Drag-and-Drop Reordering */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={selectedAreas}
          strategy={verticalListSortingStrategy}
        >
          <div style={listContainerStyle}>
            {selectedAreas.map((area) => (
              <DraggableItem key={area} id={area} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const listContainerStyle: React.CSSProperties = {
  marginTop: "12px",
  padding: "8px",
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  background: "#fafafa",
  minHeight: "50px",
};

const DraggableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px 12px",
    marginBottom: "8px",
    backgroundColor: "#e6f7ff",
    borderRadius: "4px",
    border: "1px solid #91d5ff",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {id}
    </div>
  );
};

export default DraggableSelect;
