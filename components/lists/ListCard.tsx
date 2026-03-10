"use client"

import { deleteList } from "@/actions/lists"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2, ListTodo, Calendar } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
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

interface Props {
    list: {
        id: string
        name: string
        createdAt: Date
        _count: { todos: number }
        todos: { completed: boolean }[]
    }
}

export function ListCard({ list }: Props) {
    const completedCount = list.todos.filter(t => t.completed).length
    const totalCount = list._count.todos
    const router = useRouter()

    async function handleDelete() {
        const result = await deleteList(list.id)
        if (result?.error) toast.error(result.error)
        else toast.success("List deleted!")
    }

    return (
        <Card className="hover:shadow-md transition-all group relative">

            {/* Delete button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{list.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the list and all todos inside it. This action cannot be undone.
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

            {/* Clickable card content */}
            <div
                className="cursor-pointer"
                onClick={() => router.push(`/lists/${list.id}`)}
            >
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold pr-8">
                        {list.name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ListTodo className="w-4 h-4" />
                        <span>{completedCount}/{totalCount} completed</span>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                            className="bg-green-400 h-1.5 rounded-full transition-all"
                            style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(list.createdAt), "MMM d, yyyy")}</span>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}