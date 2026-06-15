import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import { COLUMNS, STATUS_META } from "../lib/helpers.js";

function Column({ col, tasks, onAdd, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const meta = STATUS_META[col.id];

  return (
    <div className="flex w-[280px] shrink-0 flex-col md:w-auto md:flex-1">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: meta.color }}
          />
          <h3 className="text-sm font-semibold">{col.title}</h3>
          <span className="rounded-md bg-white/5 px-1.5 text-xs text-slate-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(col.id)}
          className="text-slate-400 hover:text-indigo-400 transition"
          title="Add task"
        >
          <Plus size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`glass flex min-h-[120px] flex-1 flex-col gap-2.5 rounded-2xl p-2.5 transition ${
          isOver ? "ring-2 ring-indigo-400/40" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onOpen} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <button
            onClick={() => onAdd(col.id)}
            className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 py-6 text-xs text-slate-500 hover:border-indigo-400/40 hover:text-indigo-300 transition"
          >
            <Plus size={14} className="mr-1" /> Add a task
          </button>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onMove, onAdd, onOpen }) {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const byStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (e) => {
    setActiveTask(e.active.data.current?.task || null);
  };

  const handleDragEnd = (e) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskObj = tasks.find((t) => t._id === activeId);
    if (!activeTaskObj) return;

    // Determine the destination column: either a column id, or the
    // status of the card we dropped onto.
    let destStatus = COLUMNS.find((c) => c.id === overId)?.id;
    if (!destStatus) {
      const overTask = tasks.find((t) => t._id === overId);
      destStatus = overTask?.status;
    }
    if (!destStatus || destStatus === activeTaskObj.status) return;

    onMove(activeId, destStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3"
      >
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            col={col}
            tasks={byStatus(col.id)}
            onAdd={onAdd}
            onOpen={onOpen}
          />
        ))}
      </motion.div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
