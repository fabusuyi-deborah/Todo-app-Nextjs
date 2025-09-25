// src/hooks/useTodo.js
import { useEffect, useState } from 'react';
import { todoApi } from '@/lib/todoApi';

export const useTodo = (id) => {
  const [todo, setTodo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);

    // 1. First, check localStorage
    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const localTodo = localTodos.find((t) => t.id === numericId);

    if (localTodo) {
      setTodo(localTodo);
      return;
    }

    // 2. Otherwise, try to fetch from API
    todoApi
      .getTodoById(numericId)
      .then((fetchedTodo) => {
        setTodo(fetchedTodo);
        setError(""); 
      })
      .catch(() => {
        setError("Todo not found");
      });
  }, [id]);

  return { todo, setTodo, error };
};