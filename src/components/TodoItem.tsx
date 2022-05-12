import React, { useState } from 'react';
import { Todo, TodoActions } from "../TodoApp";

interface Props {
  todo: Todo;
  ACTIONS: TodoActions;
}

export const TodoItem: React.FC<Props> = ({ todo, ACTIONS }) => {
  const { id, title, completed } = todo;
  const { toggle, remove, update } = ACTIONS;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const updateTitle = () => {
    if (newTitle.trim()) {
      update(id, newTitle);
      setIsEditing(false);
    } else {
      remove(id);
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      updateTitle()
    }

    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  }

  return (
    <li className={`${completed ? 'completed': ''} ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          className="edit"
          onBlur={updateTitle}
          onKeyDown={handleKeyDown}
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          autoFocus
        />
      ) : (
        <div className="view">
          <input
            type="checkbox"
            className="toggle"
            onChange={() => toggle(id)}
            checked={completed}
          />
          <label onDoubleClick={() => setIsEditing(true)}>
            {title}
          </label>
          <button
            type="button"
            className="destroy"
            onClick={() => remove(id)}
          />
        </div>
      )}
    </li>
  );
};
