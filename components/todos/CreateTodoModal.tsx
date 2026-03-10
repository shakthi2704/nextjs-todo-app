"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { createTodo } from "@/actions/todos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Plus } from "lucide-react"

interface Props {
    listId: string
}

export function CreateTodoModal({ listId }: Props) {
    const [open, setOpen] = useState(false)
    const createTodoWithListId = createTodo.bind(null, listId)
    const [state, action, isPending] = useActionState(createTodoWithListId, null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            toast.success("Todo added!")
            formRef.current?.reset()
            setOpen(false)
        }
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Todo
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new todo</DialogTitle>
                </DialogHeader>

                <form ref={formRef} action={action} className="space-y-4 pt-2">

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="What needs to be done?"
                            required
                            maxLength={200}
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select name="priority" defaultValue="MEDIUM">
                            <SelectTrigger id="priority">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">🟢 Low</SelectItem>
                                <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                                <SelectItem value="HIGH">🔴 High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due date (optional)</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Adding..." : "Add todo"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}