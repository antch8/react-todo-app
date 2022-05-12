import React from 'react';
import { Todo, TodoActions } from "../TodoApp";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  ACTIONS: TodoActions;
}

export const TodoList: React.FC<Props> = ({ todos, ACTIONS }) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          ACTIONS={ACTIONS}
        />
      ))}
    </ul>
  );
};
