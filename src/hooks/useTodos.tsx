// src/hooks/useTodos.js
import { useEffect, useState } from 'react';
import { todoApi } from '@/lib/todoApi';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    todoApi.getTodos()
      .then(setTodos)
      .catch(err => setError(err.message));
  }, []);

  return { todos, error };
};