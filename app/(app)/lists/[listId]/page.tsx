import { getTodos } from "@/actions/todos"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { TodoItem } from "@/components/todos/TodoItem"
import { CreateTodoModal } from "@/components/todos/CreateTodoModal"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type TodoItem = Awaited<ReturnType<typeof getTodos>>[number]

interface Props {
    params: Promise<{ listId: string }>
}

export default async function ListPage({ params }: Props) {
    const { listId } = await params
    const session = await auth()

    const list = await prisma.list.findFirst({
        where: { id: listId, userId: session!.user.id },
    })

    if (!list) notFound()

    const todos = await getTodos(listId)
    const completedCount = todos.filter((t: TodoItem) => t.completed).length

    return (
        <div className="space-y-6 max-w-2xl">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to lists
                </Link>
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{list.name}</h1>
                    <p className="text-muted-foreground mt-1">
                        {completedCount} of {todos.length} completed
                    </p>
                </div>
                <CreateTodoModal listId={listId} />
            </div>

            {todos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border rounded-lg">
                    <p className="text-lg font-medium">No todos yet</p>
                    <p className="text-sm mt-1">Add your first todo to get started</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {todos.map((todo: TodoItem) => (
                        <TodoItem key={todo.id} todo={todo} listId={listId} />
                    ))}
                </div>
            )}
        </div>
    )
}