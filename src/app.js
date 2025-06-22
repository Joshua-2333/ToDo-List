import Todo from './todo.js';
import Project from './project.js';
import storage from './storage.js';

class App {
  constructor(dom) {
    this._dom = dom;
    this.projects = storage.loadProjects();

    // Fallback in case no projects are loaded
    if (!this.projects || this.projects.length === 0) {
      const defaultProject = new Project('Default');
      this.projects = [defaultProject];
    }

    this.currentProject = this.projects[0];
  }

  get domInstance() {
    return this._dom;
  }

  set domInstance(dom) {
    this._dom = dom;
  }

  createTodo(title, description, dueDate, priority) {
    if (!title || !description || !dueDate || !priority) {
      console.error('Invalid todo data');
      return;
    }
    const todo = new Todo(title, description, dueDate, priority);
    if (this.currentProject) {
      this.currentProject.addTodo(todo);
    } else {
      console.error('No current project selected');
    }
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  deleteTodo(todo) {
    if (!this.currentProject) {
      console.error('No current project');
      return;
    }
    const index = this.currentProject.todos.findIndex((t) => t.id === todo.id);
    if (index === -1) {
      console.error('Todo not found in current project');
      return;
    }
    this.currentProject.todos.splice(index, 1); // Remove the todo from the array
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  
updateTodo(todo, title, description, dueDate, priority) {
  if (!this.currentProject) {
    console.error('No current project');
    return;
  }
  if (this.currentProject.todos.length === 0) {
    // If there are no todos, create a new one instead of updating
    this.createTodo(title, description, dueDate, priority);
    return;
  }
  const todoItem = this.currentProject.todos.find((item) => item.id === todo.id);
  if (!todoItem) {
    console.error('Todo not found in current project');
    return;
  }
  todoItem.title = title;
  todoItem.description = description;
  todoItem.dueDate = dueDate;
  todoItem.priority = priority;
  storage.saveProjects(this.projects);
  if (this.domInstance) {
    this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
  }
}
  toggleTodoCompleted(todoId) {
    if (!this.currentProject) {
      console.error('No current project');
      return;
    }
    const todo = this.currentProject.todos.find((todo) => todo.id === todoId);
    if (!todo) {
      console.error('Todo not found in current project');
      return;
    }
    todo.completed = !todo.completed;
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  addProject(projectName) {
    if (this.projects.find((project) => project.name === projectName)) {
      console.error('Project with the same name already exists');
      return;
    }

    const project = new Project(projectName);
    this.projects.push(project);
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  switchProject(project) {
    this.currentProject = project;
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  deleteProject(project) {
    this.projects = this.projects.filter((p) => p !== project);
    if (this.currentProject === project) {
      this.currentProject = this.projects.length > 0 ? this.projects[0] : null;
    }
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  updateProject(project, projectName) {
    project.name = projectName;
    storage.saveProjects(this.projects);
    if (this.domInstance) {
      this.domInstance.renderTodoList(); // Call renderTodoList to update the DOM
    }
  }

  getProjects() {
    return this.projects;
  }

  getCurrentProject() {
    return this.currentProject;
  }

  getTodosForCurrentProject() {
    return this.currentProject ? this.currentProject.todos : [];
  }
}

export default App;