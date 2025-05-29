import React from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableField: single draggable field block
function SortableField({
  field,
  idx,
  selectedIdx,
  onSelect,
  onRemove,
  listeners,
  attributes,
  setNodeRef,
  style,
}) {
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(idx)}
      tabIndex={0}
      className={`group relative flex items-center justify-between gap-2 p-4 rounded-lg shadow-sm cursor-pointer border transition-all duration-300
        ${
          selectedIdx === idx
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
            : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
        }
        hover:shadow-md hover:ring-1 hover:ring-indigo-300 focus:outline-none`}
    >
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {field.config.label}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({field.type})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
          title="Remove field"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(idx);
          }}
        >
          🗑️
        </button>
        <span
          className="text-gray-400 dark:text-gray-500 cursor-grab transition group-hover:scale-110"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
          {...listeners}
          {...attributes}
        >
          ⠿
        </span>
      </div>
    </div>
  );
}

export default function FormCanvas({
  steps,
  setSteps,
  activeStep,
  onSelect,
  selectedIdx,
  onDrop,
  onDragOver,
}) {
  const fields = steps[activeStep].fields;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex);
      setSteps(
        steps.map((step, idx) =>
          idx === activeStep ? { ...step, fields: newFields } : step
        )
      );
    }
  };

  const handleRemove = (idx) => {
    const newFields = [...fields];
    newFields.splice(idx, 1);
    setSteps(
      steps.map((step, i) =>
        i === activeStep ? { ...step, fields: newFields } : step
      )
    );
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 min-h-[400px] transition-all duration-500 border border-gray-200 dark:border-gray-700"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
        Fields in this Step
      </h3>

      {fields.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-20 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-500">
          Drag fields here to build your form <br />
          Double-click on a form field to edit its properties in the field
          settings panel. <br />
          Double-click the 🗑️ dustbin icon to remove the field.
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {fields.map((field, idx) => (
              <SortableFieldWrapper
                key={field.id}
                id={field.id}
                idx={idx}
                field={field}
                selectedIdx={selectedIdx}
                onSelect={onSelect}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableFieldWrapper({
  id,
  field,
  idx,
  selectedIdx,
  onSelect,
  onRemove,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <SortableField
      field={field}
      idx={idx}
      selectedIdx={selectedIdx}
      onSelect={onSelect}
      onRemove={onRemove}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
      style={style}
    />
  );
}
