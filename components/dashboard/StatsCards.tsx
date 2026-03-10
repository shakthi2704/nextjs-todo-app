import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListTodo, CheckCheck, Clock } from "lucide-react"

interface Props {
    total: number
    completed: number
    pending: number
}

export function StatsCards({ total, completed, pending }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Todos
                    </CardTitle>
                    <ListTodo className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{total}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending
                    </CardTitle>
                    <Clock className="w-4 h-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{pending}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Completed
                    </CardTitle>
                    <CheckCheck className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{completed}</p>
                </CardContent>
            </Card>
        </div>
    )
}