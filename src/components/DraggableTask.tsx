import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import UpdateDialog from "./UpdateDialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
    task: {
        _id: string;
        title: string;
        description: string;
        category: "to-do" | "in-progress" | "done";
        timestamp?: string;
    };
    refetch: () => void
}

const DraggableTask = ({ task, refetch }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id,
        data: { category: task.category },
    });
    const [open, setOpen] = useState<boolean>(false);

    const handleDelete = async (id: string) => {
        try {
            const { data } = await axios.delete(`/api/tasks/${id}`)
            console.log(data)
            if (data.message) {
                toast.success(data.message)
                refetch()
            }
        } catch (error) {
            if (error) {
                toast.error("Unexpected error")
            }
        }
    }

    const handleUpdate = (id: string) => {
        console.log("update", id)
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}>
            <Card key={task._id} className="mb-3 bg-black/5 cursor-grab">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => {
                                    setOpen(true)
                                    handleUpdate(task._id)
                                }} size="icon">
                                <Pencil />
                            </Button>
                            <UpdateDialog refetch={refetch} task={task} open={open} setOpen={setOpen} />
                            {/* delete button */}
                            <Button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() =>
                                    toast.custom((t) => (
                                        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 flex flex-col gap-2">
                                            <p className="text-lg font-semibold">Are you sure you want to delete &quot;{task.title}&quot;?</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                You won&apos;t be able to revert this!
                                            </p>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => toast.dismiss(t)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => {
                                                        handleDelete(task._id); 
                                                        toast.dismiss(t); 
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                                size="icon"
                            >
                                <FileX2 />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {task.timestamp ? <p>{moment(task.timestamp).format("LLLL")}</p> : null}
                    <Badge className={`
            ${task.category === "in-progress" ? "bg-yellow-400 text-black" : ""}
            ${task.category === "done" ? "bg-green-400 text-black" : ""}
            `}>{task.category}</Badge>
                </CardContent>
            </Card>
        </div>
    );
};

export default DraggableTask