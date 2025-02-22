/* eslint-disable react-hooks/rules-of-hooks */
"use client";


import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import DroppableContainer from "./DroppableContainer";
import Loader from "./loader";
import { toast } from "sonner";


export interface TaskProps {
  _id: string;
  title: string;
  description: string;
  category: "to-do" | "in-progress" | "done";
  timestamp?: string;
}

interface Props {
  tasks: TaskProps[];
  isLoading: boolean;
  refetch: ()=> void;
}

// Dummy dashboard component with content

const Dashboard = ({tasks, isLoading, refetch}: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (loading) return <Loader />;
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  


  // Local state for tasks
  const [taskState, setTaskState] = useState<Record<string, TaskProps[]>>({
    "to-do": [],
    "in-progress": [],
    "done": [],
  });

  useEffect(() => {
    if (tasks.length > 0) {
      setTaskState({
        "to-do": tasks.filter((task) => task.category === "to-do"),
        "in-progress": tasks.filter((task) => task.category === "in-progress"),
        "done": tasks.filter((task) => task.category === "done"),
      });
    }
  }, [tasks]);


  // Mutation to update task category in the backend
  const updateTaskCategory = useMutation({
    mutationFn: async ({ taskId, newCategory }: { taskId: string; newCategory: string }) => {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${taskId}`, {
        category: newCategory,
      });
    },
    onSuccess: () => {
      toast.success("Done")
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error updating task category:", error);
    },
  });


  // Handle Drag End
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const sourceCategory = active.data.current?.category;
    const targetCategory = over.id;

    if (!sourceCategory || sourceCategory === targetCategory) return;

    const movedTask = taskState[sourceCategory]?.find((t) => t._id === active.id);
    if (!movedTask) return;

    // Optimistically update local state
    setTaskState((prev) => ({
      ...prev,
      [sourceCategory]: prev[sourceCategory].filter((t) => t._id !== active.id),
      [targetCategory]: [...prev[targetCategory], { ...movedTask, category: targetCategory }],
    }));

    // Update backend
    updateTaskCategory.mutate({ taskId: movedTask._id, newCategory: targetCategory });
  };

  if (isLoading) return <Loader />;


  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="grid flex-1 pt-5 md:grid-cols-12 overflow-y-auto pl-6 gap-4 ">
        <DroppableContainer refetch={refetch} title="To-Do" category="to-do" tasks={taskState["to-do"]} />
        <DroppableContainer refetch={refetch} title="In Progress" category="in-progress" tasks={taskState["in-progress"]} />
        <DroppableContainer refetch={refetch} title="Done" category="done" tasks={taskState["done"]} />
      </div>
    </DndContext>
  );
};

export default Dashboard  