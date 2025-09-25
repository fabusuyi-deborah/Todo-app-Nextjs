// services/todoApi.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const todoApi = {
  // Fetch all todos
  getTodos: async () => {
    try {
      const res = await fetch(`${BASE_URL}/todos`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  },
  // Fetch a single todo by ID
  getTodoById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`);
      if (!res.ok) throw new Error(`Todo not found. Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Failed to fetch todo with ID ${id}:`, error);
      throw error;
    }
  },

    createTodo: async (todoData) => {
    try {
      const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      if (!res.ok) throw new Error(`Failed to create todo. Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  },

  // Update an existing todo by ID
  updateTodo: async (id, todoData) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      if (!res.ok) throw new Error(`Failed to update todo. Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Failed to update todo with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a todo by ID
  deleteTodo: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to delete todo. Status: ${res.status}`);
      return { message: 'Todo deleted successfully' };
    } catch (error) {
      console.error(`Failed to delete todo with ID ${id}:`, error);
      throw error;
    }
  },
};

