import { Button, Box, Heading, VStack, HStack, Input, ListItem, Spacer, List,IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdDelete } from "react-icons/md";

export default function Main() {
  const [todos, setTodos] = useState([]);
  const [addTodo, setAddTodo] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:4000/api/auth/status', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTodos = async () => {
        const response = await axios.get('http://localhost:4000/api/todos', { withCredentials: true });
        setTodos(response.data);
      };
      fetchTodos();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const response = await axios.put(`http://localhost:4000/api/todos/${editTodoId}`, { description: addTodo }, { withCredentials: true });
      if (response.status === 200) {
        setTodos(todos.map(todo => todo._id === editTodoId ? response.data : todo));
      } else {
        console.error('Failed to update todo:', response);
      }
      setIsEditing(false);
      setEditTodoId(null);
    } else {
      const response = await axios.post('http://localhost:4000/api/todos', { description: addTodo }, { withCredentials: true });
      setTodos([...todos, response.data]);
    }
    setAddTodo("");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/todos/${id}`, { withCredentials: true });
    setTodos(todos.filter(todo => todo._id !== id));
    if (isEditing && id === editTodoId) {
      setIsEditing(false);
      setEditTodoId(null);
      setAddTodo("");
    }
  };

  const handleEdit = (id, description) => {
    setIsEditing(true);
    setAddTodo(description);
    setEditTodoId(id);
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your to-do list.</div>;
  }

  return (
    <VStack p="2rem">
      <Box height="7rem">
        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              type="text"
              maxW="35rem"
              value={addTodo}
              onChange={(e) => setAddTodo(e.target.value)}
              borderColor='purple'
            />
            <Button px="1.5rem" colorScheme="purple" isDisabled={!addTodo.trim()} _disabled={{ bg: 'purple.500', cursor: 'not-allowed' }} type="submit">
              {isEditing ? 'Update item' : 'Add item'}
            </Button>
          </HStack>
        </form>
      </Box>
      <Box px="2rem">
        <VStack>
          <List spacing={1}>
            {todos.map((todo, index) => (
              <ListItem key={todo._id}>
                <HStack maxW="25rem">
                  <Heading size="2rem">{index + 1}. {todo.description}</Heading>
                  <Spacer />
                  <IconButton
                    icon={<MdEdit />}
                    colorScheme="purple"
                    onClick={() => handleEdit(todo._id, todo.description)}
                    aria-label="Edit todo"
                  />
                  <IconButton
                    icon={<MdDelete />}
                    colorScheme="red"
                    onClick={() => handleDelete(todo._id)}
                    aria-label="Delete todo"
                  />
                </HStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Box>
    </VStack>
  );
}
