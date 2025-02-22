import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";
import { TaskProps } from "./Dashboard";


interface Props {
    title: string;
    category: string;
    tasks: TaskProps[];
    refetch: ()=> void;
  }

const DroppableContainer = ({ title, category, tasks, refetch }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: category });

  return (
    <div
      ref={setNodeRef}
      className={`col-span-4 border h-full p-6 rounded-lg transition-all ${
        isOver ? "bg-gray-200 dark:bg-black " : "bg-white dark:bg-black/10"
      }`}
    >
      <h1 className="text-xl flex items-center justify-center mb-3">{title}</h1>
      {tasks.map((task) => (
        <DraggableTask refetch={refetch} key={task._id} task={task} />
      ))}
    </div>
  );
};

export default DroppableContainer;
