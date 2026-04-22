"use client";

import TodosBoard from "./TodosBoard";
import { useTodos } from "../hooks/useTodos";

export default function TodosPageClient() {
  const { todos, loading, error, addTodo, editTodo, toggleTodo, removeTodo } =
    useTodos();

  return (
    <main className="p-6">
      <TodosBoard
        todos={todos}
        loading={loading}
        error={error}
        onCreate={addTodo}
        onEdit={editTodo}
        onToggle={toggleTodo}
        onDelete={removeTodo}
      />
    </main>
  );
}
