import { useDraggable } from "@dnd-kit/core";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

interface Props {
    task: {
        _id: string;
        title: string;
        description: string;
        category: "to-do" | "in-progress" | "done";
        timestamp?: string;
    }
}

const DraggableTask = ({ task }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id,
        data: { category: task.category },
    });

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
                            <Button size="icon">
                                <FileX2 />
                            </Button>
                            <Button size="icon">
                                <Pencil />
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