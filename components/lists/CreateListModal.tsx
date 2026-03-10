"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { createList } from "@/actions/lists"
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
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function CreateListModal() {
    const [open, setOpen] = useState(false)
    const [state, action, isPending] = useActionState(createList, null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            toast.success("List created!")
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
                    New List
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new list</DialogTitle>
                </DialogHeader>

                <form ref={formRef} action={action} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">List name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Work tasks, Shopping..."
                            required
                            maxLength={50}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating..." : "Create list"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}