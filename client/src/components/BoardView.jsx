import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import {
  useChangeTaskStageMutation,
  useCreateTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import clsx from "clsx";
import { CircleDot, Clock, CheckCircle2, Plus, X } from "lucide-react";

const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    icon: <CircleDot className="w-3.5 h-3.5 text-slate-500" />,
    badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    dotColor: "bg-slate-400",
  },
  {
    id: "in progress",
    title: "In Progress",
    icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
    badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
    dotColor: "bg-blue-500",
  },
  {
    id: "completed",
    title: "Completed",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
    dotColor: "bg-emerald-500",
  },
];

const BoardView = ({ tasks = [] }) => {
  const { user } = useSelector((state) => state.auth);

  const [columnsData, setColumnsData] = useState({
    todo: [],
    "in progress": [],
    completed: [],
  });

  // Inline Quick-Add states
  const [addingColumnId, setAddingColumnId] = useState(null);
  const [inlineTitle, setInlineTitle] = useState("");
  const [inlinePriority, setInlinePriority] = useState("normal");

  const [changeStage] = useChangeTaskStageMutation();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  useEffect(() => {
    const grouped = {
      todo: [],
      "in progress": [],
      completed: [],
    };

    tasks.forEach((t) => {
      const stage = t.stage?.toLowerCase() || "todo";
      if (grouped[stage]) {
        grouped[stage].push(t);
      } else {
        grouped.todo.push(t);
      }
    });

    setColumnsData(grouped);
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    const sourceList = Array.from(columnsData[sourceColumnId]);
    const destList =
      sourceColumnId === destColumnId
        ? sourceList
        : Array.from(columnsData[destColumnId]);

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, stage: destColumnId };

    destList.splice(destination.index, 0, updatedTask);

    setColumnsData((prev) => ({
      ...prev,
      [sourceColumnId]: sourceList,
      [destColumnId]: destList,
    }));

    if (sourceColumnId !== destColumnId) {
      try {
        await changeStage({
          id: draggableId,
          stage: destColumnId,
        }).unwrap();

        toast.success(`Task shifted to ${destColumnId.toUpperCase()}`, {
          action: {
            label: "Undo",
            onClick: async () => {
              try {
                await changeStage({
                  id: draggableId,
                  stage: sourceColumnId,
                }).unwrap();
                toast.success(`Reverted back to ${sourceColumnId.toUpperCase()}`);
              } catch {
                toast.error("Failed to undo stage transition");
              }
            },
          },
          duration: 4500,
        });
      } catch {
        toast.error("Failed to update task stage on server");
        // Revert to original
        setColumnsData((prev) => {
          const revertSource = Array.from(prev[sourceColumnId]);
          const revertDest = Array.from(prev[destColumnId]);
          const [item] = revertDest.splice(destination.index, 1);
          revertSource.splice(source.index, 0, { ...item, stage: sourceColumnId });
          return {
            ...prev,
            [sourceColumnId]: revertSource,
            [destColumnId]: revertDest,
          };
        });
      }
    }
  };

  const handleInlineSubmit = async (columnId) => {
    if (!inlineTitle.trim()) return;
    try {
      await createTask({
        title: inlineTitle.trim(),
        stage: columnId,
        priority: inlinePriority,
        date: new Date(),
        team: user?._id ? [user._id] : [],
      }).unwrap();

      toast.success("Task created", { description: inlineTitle.trim() });
      setInlineTitle("");
      // Keep input open for rapid multi-task entry
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to create task");
    }
  };

  return (
    <div className="w-full py-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Responsive Kanban container */}
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 items-start overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 scroll-smooth">
          {COLUMNS.map((column) => {
            const columnTasks = columnsData[column.id] || [];
            const isAddingInline = addingColumnId === column.id;

            return (
              <div
                key={column.id}
                role="region"
                aria-label={`${column.title} column, ${columnTasks.length} tasks`}
                className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 md:shrink flex flex-col bg-slate-100/70 dark:bg-[#0c0e15] p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#1d202d] min-h-[520px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-200/80 dark:border-[#1d202d]">
                  <div className="flex items-center gap-2">
                    <span className={clsx("w-2 h-2 rounded-full", column.dotColor)} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                      {column.title}
                    </h3>
                    <span
                      className={clsx(
                        "font-mono text-[11px] font-semibold px-2 py-0.5 rounded border tabular-nums",
                        column.badgeColor
                      )}
                    >
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingColumnId(column.id);
                        setInlineTitle("");
                        setInlinePriority("normal");
                      }}
                      aria-label={`Inline add task to ${column.title}`}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-[#181c2a] transition-colors cursor-pointer"
                      title="Quick inline add"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Droppable Column Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        "flex-1 flex flex-col gap-3 transition-colors rounded-lg min-h-[380px] p-0.5",
                        snapshot.isDraggingOver
                          ? "bg-blue-50/50 dark:bg-[#111626] ring-1 ring-blue-500/30"
                          : ""
                      )}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={clsx(
                                "transform-gpu transition-shadow",
                                dragSnapshot.isDragging
                                  ? "rotate-1 scale-[1.02] z-50 shadow-xl opacity-95 ring-1 ring-blue-500/50"
                                  : ""
                              )}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Inline Quick-Add Card */}
                      {isAddingInline ? (
                        <div className="bg-white dark:bg-[#12151f] p-3 rounded-xl border border-blue-500/50 shadow-md space-y-2 mt-2 animate-in fade-in duration-150">
                          <input
                            type="text"
                            value={inlineTitle}
                            onChange={(e) => setInlineTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && inlineTitle.trim()) {
                                handleInlineSubmit(column.id);
                              } else if (e.key === "Escape") {
                                setAddingColumnId(null);
                              }
                            }}
                            placeholder="What needs to be done? (↵ to save, Esc to cancel)"
                            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#1d202d]">
                            <div className="flex items-center gap-1">
                              {["normal", "high", "medium", "low"].map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setInlinePriority(p)}
                                  className={clsx(
                                    "px-1.5 py-0.5 rounded text-[10px] font-mono capitalize border transition-colors cursor-pointer",
                                    inlinePriority === p
                                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                                      : "bg-slate-100 dark:bg-[#181c28] text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                                  )}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setAddingColumnId(null)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInlineSubmit(column.id)}
                                disabled={!inlineTitle.trim() || isCreating}
                                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] font-bold disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
                              >
                                {isCreating ? "Adding..." : "Add"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddingColumnId(column.id);
                            setInlineTitle("");
                            setInlinePriority("normal");
                          }}
                          className="w-full mt-2 py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-[#1e2333] hover:border-blue-500/50 hover:bg-white/60 dark:hover:bg-[#12151f] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add task</span>
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardView;
