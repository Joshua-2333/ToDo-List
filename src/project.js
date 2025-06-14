class Project {
  constructor(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Project name must be a non-empty string');
    }
    this.name = name;
    this.todos = [];
    this.id = Math.floor(Math.random() * 10000);
  }

  addTodo(todo) {
    if (!todo.id) {
      todo.id = Math.floor(Math.random() * 10000);
    }
    this.todos.push(todo);
  }

  removeTodo(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  updateTodo(id, updates) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      Object.assign(this.todos[index], updates);
    }
  }

  getTodoByValue(todo) {
    return this.todos.find((t) => t === todo);
  }

  getTodoById(id) {
    return this.todos.find((t) => t.id === id);
  }

  getTodos() {
    return this.todos;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  toString() {
    return `Project: ${this.name} - Todos: ${this.todos.length}`;
  }
}

export default Project;