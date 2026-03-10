"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { updateList } from "@/actions/lists"
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
import { Pencil } from "lucide-react"

interface Props {
    list: {
        id: string
        name: string
    }
}

export function EditListModal({ list }: Props) {
    const [open, setOpen] = useState(false)
    const updateListWithId = updateList.bind(null, list.id)
    const [state, action, isPending] = useActionState(updateListWithId, null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            toast.success("List updated!")
            setOpen(false)
        }
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit list name</DialogTitle>
                </DialogHeader>

                <form ref={formRef} action={action} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">List name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={list.name}
                            required
                            maxLength={50}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}