"use client";

import { useEffect, useState } from "react";

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  saveTodo,
  setTodoCompleted,
} from "../api/todos.api";
import type { TodoFormValues, TodoItem } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTodos() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTodos();
        if (isMounted) {
          setTodos(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load todos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTodo = async (values: TodoFormValues) => {
    const todo = await createTodo(values);
    setTodos((currentTodos) => [todo, ...currentTodos]);
    return todo;
  };

  const editTodo = async (id: string, values: TodoFormValues) => {
    const todo = await saveTodo(id, values);
    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.id === id ? todo : currentTodo,
      ),
    );
    return todo;
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const todo = await setTodoCompleted(id, completed);
    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.id === id ? todo : currentTodo,
      ),
    );
    return todo;
  };

  const removeTodo = async (id: string) => {
    await deleteTodo(id);
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  };
}
