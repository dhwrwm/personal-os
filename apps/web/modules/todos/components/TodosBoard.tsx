"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { TodoFormValues, TodoItem } from "../types";
import TodoFormDialog from "./TodoFormDialog";

type TodosBoardProps = {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  onCreate: (values: TodoFormValues) => Promise<unknown>;
  onEdit: (id: string, values: TodoFormValues) => Promise<unknown>;
  onToggle: (id: string, completed: boolean) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
};

function renderPriority(priority: TodoItem["todo"]["priority"]) {
  if (priority === "high") {
    return "High";
  }
  if (priority === "low") {
    return "Low";
  }
  return "Medium";
}

export default function TodosBoard({
  todos,
  loading,
  error,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
}: TodosBoardProps) {
  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading todos...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-500">{error}</div>;
  }

  const openTodos = todos.filter((todo) => !todo.todo.completed);
  const completedTodos = todos.filter((todo) => todo.todo.completed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Todos</h1>
          <p className="text-sm text-muted-foreground">
            Track work in progress and completed tasks in one place.
          </p>
        </div>
        <TodoFormDialog
          mode="create"
          triggerLabel="Add todo"
          onSubmit={onCreate}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {[
          { title: "Open", items: openTodos, completed: false },
          { title: "Completed", items: completedTodos, completed: true },
        ].map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-border/70 bg-muted/30 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h2>
              <span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                {section.items.length}
              </span>
            </div>
            {section.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                No {section.title.toLowerCase()} todos yet.
              </div>
            ) : (
              <div className="space-y-3">
                {section.items.map((todo) => (
                  <Card key={todo.id} className="border-border/70">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base">{todo.title}</CardTitle>
                        <span className="rounded-full bg-secondary px-2 py-1 text-[11px] uppercase tracking-wide text-secondary-foreground">
                          {renderPriority(todo.todo.priority)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {todo.content ? (
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {todo.content}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No additional details.
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {todo.tags.length > 0 ? (
                          todo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-background px-2 py-1 text-[11px] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No tags</span>
                        )}
                      </div>
                      {todo.todo.dueDate ? (
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(todo.todo.dueDate).toLocaleDateString()}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => void onToggle(todo.id, !todo.todo.completed)}
                        >
                          {section.completed ? "Mark as open" : "Mark done"}
                        </Button>
                        <TodoFormDialog
                          mode="edit"
                          todo={todo}
                          triggerLabel="Edit"
                          triggerVariant="outline"
                          onSubmit={(values) => onEdit(todo.id, values)}
                        />
                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => void onDelete(todo.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
