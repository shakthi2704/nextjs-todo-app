"use client"

import { toggleTodo, deleteTodo } from "@/actions/todos"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Todo, Priority } from "@prisma/client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"

const priorityConfig: Record<Priority, { label: string; class: string }> = {
    LOW: { label: "Low", class: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    MEDIUM: { label: "Medium", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
    HIGH: { label: "High", class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
}

interface Props {
    todo: Todo
    listId: string
}

export function TodoItem({ todo, listId }: Props) {
    async function handleToggle() {
        const result = await toggleTodo(todo.id, listId)
        if (result?.error) toast.error(result.error)
    }

    async function handleDelete() {
        const result = await deleteTodo(todo.id, listId)
        if (result?.error) toast.error(result.error)
        else toast.success("Todo deleted!")
    }

    const priority = priorityConfig[todo.priority]
    const isOverdue = todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        !todo.completed

    return (
        <div className={cn(
            "flex items-start gap-3 p-4 bg-card rounded-lg border group transition-opacity",
            todo.completed && "opacity-60"
        )}>
            {/* Checkbox */}
            <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="mt-0.5"
            />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
                <p className={cn(
                    "text-sm font-medium",
                    todo.completed && "line-through text-muted-foreground"
                )}>
                    {todo.title}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority badge */}
                    <Badge
                        variant="secondary"
                        className={cn("text-xs px-1.5 py-0", priority.class)}
                    >
                        {priority.label}
                    </Badge>

                    {/* Due date */}
                    {todo.dueDate && (
                        <span className={cn(
                            "flex items-center gap-1 text-xs",
                            isOverdue
                                ? "text-red-500 font-medium"
                                : "text-muted-foreground"
                        )}>
                            <Calendar className="w-3 h-3" />
                            {format(new Date(todo.dueDate), "MMM d, yyyy")}
                            {isOverdue && " · Overdue"}
                        </span>
                    )}
                </div>
            </div>

            {/* Delete button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 shrink-0"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete todo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{todo.title}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}