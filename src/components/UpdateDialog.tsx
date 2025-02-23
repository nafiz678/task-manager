import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from './ui/button'
import axios from 'axios'

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(50, "Title must be under 50 characters"),
    description: z.string().min(1, "Description is required")
});
type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    task: {
        _id: string;
        title: string;
        description: string;
        category: "to-do" | "in-progress" | "done";
        timestamp?: string;
    };
    refetch: () => void;
}

const UpdateDialog = ({ open, setOpen, task, refetch }: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task.title,
            description: task.description
        }
    });


    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Sending the updated title and description in the PUT request
            const { title, description } = values;
            const response = await axios.put(`/api/tasks/${task._id}`, {
                title,
                description
            });

            if (response.data?.message) {
                toast.success("Task Updated Successfully!");
                refetch()
                setOpen(false);
            } else {
                toast.error("Failed to update the task. Please try again.");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task. Please try again.");
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen} >

            <DialogContent onPointerDown={(e) => e.stopPropagation()} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a task</DialogTitle>
                    <DialogDescription>
                        Enter the details of your new task to keep track of your progress.
                    </DialogDescription>
                </DialogHeader>
                {/* content */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your title"
                                            onKeyDown={(e) => e.stopPropagation()}
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description here..."
                                            onKeyDown={(e) => e.stopPropagation()}
                                            className="resize-y"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Update Task</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDialog