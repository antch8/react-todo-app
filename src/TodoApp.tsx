import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { TodoList } from "./components/TodoList";

import 'todomvc-app-css/index.css';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoActions {
  add: (title: string) => void;
  toggle: (id: number) => void;
  toggleAll: () => void;
  update: (id: number, newTitle: string) => void;
  remove: (id: number) => void;
  removeCompleted: () => void;
}

enum Filters {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export const TodoApp: React.FC = () => {
  const getTodos = useCallback((): Todo[] => {
    return localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos') || '')
      : []
  }, []);

  const [todos, setTodos] = useState<Todo[]>(getTodos());

  const saveTodos = useCallback(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos]);

  const [title, setTitle] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.all);

  useEffect(() => saveTodos(), [saveTodos]);

  const filter = (todos: Todo[], selectedFilter: Filters) => {
    switch (selectedFilter) {
      case Filters.all:
        return todos;
      case Filters.active:
        return todos.filter(({ completed }) => !completed);
      case Filters.completed:
        return todos.filter(({ completed }) => completed);
      default:
        return todos;
    }
  }

  const notCompletedCount = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const ACTIONS: TodoActions = {
    add: useCallback((title: string) => {
      setTodos((prev) => ([
        ...prev, { id: Date.now(), title, completed: false },
      ]));
    }, []),

    toggle: useCallback((id: number) => {
      setTodos((prev) => ([
        ...prev.map((todo) => (todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
        )),
      ]));
    }, []),

    toggleAll: useCallback(() => {
      setTodos((prev) => ([
        ...prev.map((todo) => ({ ...todo, completed: !!notCompletedCount }))
      ]));
    }, [notCompletedCount]),

    update: useCallback((id: number, newTitle: string) => {
      setTodos((prev) => ([
        ...prev.map((todo) => (todo.id === id
          ? { ...todo, title: newTitle }
          : todo
        )),
      ]));
    }, []),

    remove: useCallback((id: number) => {
      setTodos((prev) => ([
        ...prev.filter((todo) => todo.id !== id)
      ]));
    }, []),

    removeCompleted: useCallback(() => {
      setTodos((prev) => ([
        ...prev.filter(({ completed }) => !completed),
      ]));
    }, []),
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (title) {
      ACTIONS.add(title);
      setTitle('');
    }
  };

  const capitalize = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="new-todo"
            placeholder="What needs to be done?"
            onChange={e => setTitle(e.target.value)}
            value={title}
            autoFocus
          />
        </form>
      </header>

      {!!todos.length && (
        <>
          <section className="main">
            <span>
              <input
                type="checkbox"
                id="toggle-all"
                className="toggle-all"
                onChange={() => ACTIONS.toggleAll()}
                checked={!notCompletedCount}
              />
              <label htmlFor="toggle-all">Mark all as complete</label>
            </span>

            {
              <TodoList
                todos={filter(todos, selectedFilter)}
                ACTIONS={ACTIONS}
              />
            }
          </section>

          <footer className="footer">
            <span className="todo-count">
              {notCompletedCount === 1
                ? `${notCompletedCount} task left`
                : notCompletedCount > 0
                  ? `${notCompletedCount} tasks left`
                  : 'All completed'
              }
            </span>

            <ul className="filters">
              {Object.keys(Filters).map((filter) => (
                <li key={filter}>
                  <a
                    // href={`#/${filter === Filters.all ? '' : filter}`}
                    className={filter === selectedFilter ? 'selected' : ''}
                    onClick={() => setSelectedFilter(filter as Filters)}
                    style={{ cursor: 'pointer' }}
                  >
                    {capitalize(filter)}
                  </a>
                </li>
              ))}
            </ul>

            {todos.length - notCompletedCount > 0 && (
              <button
                type="button"
                className="clear-completed"
                onClick={() => ACTIONS.removeCompleted()}
              >
                Clear completed
              </button>
            )}
          </footer>
        </>
      )}
    </section>
  );
};
