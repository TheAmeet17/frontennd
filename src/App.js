import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'; 

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todos'); // Update the endpoint
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3001/todos', {
          // Update the endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTodo, status: 'ongoing' }),
        });

        if (response.ok) {
          const createdTodo = await response.json();
          setTodos([...todos, createdTodo]);
          setNewTodo('');
        } else {
          console.error('Failed to add todo:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ongoing' ? 'completed' : 'ongoing';

    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        // Update the endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        );
        setTodos(updatedTodos);
      } else {
        console.error('Failed to toggle status:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - Status: {todo.status}
            <button onClick={() => toggleStatus(todo.id, todo.status)}>
              Toggle Status
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
};


export default App;