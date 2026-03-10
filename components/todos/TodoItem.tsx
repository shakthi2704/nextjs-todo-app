"use client"

import { useState } from "react"
import { toggleTodo, deleteTodo, updateTodo } from "@/actions/todos"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Trash2, Calendar, Pencil, Check, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Todo } from "@prisma/client"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const priorityConfig: Record<Priority, { label: string; class: string }> = {
    LOW: { label: "Low", class: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    MEDIUM: { label: "Medium", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
    HIGH: { label: "High", class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
}

interface TodoType {
    id: string
    title: string
    completed: boolean
    priority: "LOW" | "MEDIUM" | "HIGH"
    dueDate: Date | null
    createdAt: Date
    updatedAt: Date
    listId: string
}

interface Props {
    todo: TodoType
    listId: string
}
type Priority = "LOW" | "MEDIUM" | "HIGH"

export function TodoItem({ todo, listId }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
    const [editDueDate, setEditDueDate] = useState(
        todo.dueDate ? format(new Date(todo.dueDate), "yyyy-MM-dd") : ""
    )
    const [isSaving, setIsSaving] = useState(false)

    async function handleToggle() {
        const result = await toggleTodo(todo.id, listId)
        if (result?.error) toast.error(result.error)
    }

    async function handleDelete() {
        const result = await deleteTodo(todo.id, listId)
        if (result?.error) toast.error(result.error)
        else toast.success("Todo deleted!")
    }

    async function handleSave() {
        if (!editTitle.trim()) {
            toast.error("Title is required")
            return
        }

        setIsSaving(true)
        const formData = new FormData()
        formData.set("title", editTitle)
        formData.set("priority", editPriority)
        formData.set("dueDate", editDueDate)

        const result = await updateTodo(todo.id, listId, null, formData)
        setIsSaving(false)

        if (result?.error) toast.error(result.error)
        else {
            toast.success("Todo updated!")
            setIsEditing(false)
        }
    }

    function handleCancel() {
        setEditTitle(todo.title)
        setEditPriority(todo.priority)
        setEditDueDate(todo.dueDate ? format(new Date(todo.dueDate), "yyyy-MM-dd") : "")
        setIsEditing(false)
    }

    const priority = priorityConfig[todo.priority]
    const isOverdue = todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        !todo.completed

    return (
        <div className={cn(
            "flex items-start gap-3 p-4 bg-card rounded-lg border group transition-opacity",
            todo.completed && !isEditing && "opacity-60"
        )}>
            {/* Checkbox */}
            <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="mt-0.5"
                disabled={isEditing}
            />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
                {isEditing ? (
                    <>
                        {/* Edit title */}
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                        />

                        {/* Edit priority + due date */}
                        <div className="flex gap-2 flex-wrap">
                            <Select
                                value={editPriority}
                                onValueChange={(v) => setEditPriority(v as Priority)}
                            >
                                <SelectTrigger className="h-8 w-32 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">🟢 Low</SelectItem>
                                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                                    <SelectItem value="HIGH">🔴 High</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="h-8 w-36 text-xs"
                            />
                        </div>

                        {/* Save / Cancel buttons */}
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="h-7 text-xs"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Check className="w-3 h-3 mr-1" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={handleCancel}
                            >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className={cn(
                            "text-sm font-medium",
                            todo.completed && "line-through text-muted-foreground"
                        )}>
                            {todo.title}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="secondary"
                                className={cn("text-xs px-1.5 py-0", priority.class)}
                            >
                                {priority.label}
                            </Badge>

                            {todo.dueDate && (
                                <span className={cn(
                                    "flex items-center gap-1 text-xs",
                                    isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
                                )}>
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(todo.dueDate), "MMM d, yyyy")}
                                    {isOverdue && " · Overdue"}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Action buttons */}
            {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {/* Edit button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </Button>

                    {/* Delete button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-red-500"
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
            )}
        </div>
    )
}