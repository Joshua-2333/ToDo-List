// app.js
import Todo from './todo.js';
import Project from './project.js';
import storage from './storage.js';

class App {
  constructor() {
    this.projects = storage.loadProjects();

    // Fallback in case no projects are loaded
    if (!this.projects || this.projects.length === 0) {
      const defaultProject = new Project('Default');
      this.projects = [defaultProject];
    }

    this.currentProject = this.projects[0];
  }

  createTodo(title, description, dueDate, priority) {
    if (!title || !description || !dueDate || !priority) {
      console.error('Invalid todo data');
      return;
    }
    const todo = new Todo(title, description, dueDate, priority);
    this.currentProject.addTodo(todo);
    storage.saveProjects(this.projects);
  }

  deleteTodo(todo) {
    if (!this.currentProject.todos.includes(todo)) {
      console.error('Todo not found in current project');
      return;
    }
    this.currentProject.removeTodo(todo);
    storage.saveProjects(this.projects);
  }

  updateTodo(todo, title, description, dueDate, priority) {
    const updatedTodo = new Todo(title, description, dueDate, priority);
    this.currentProject.updateTodo(todo, updatedTodo);
    storage.saveProjects(this.projects);
  }

  toggleTodoCompleted(todo) {
    if (todo.completed) {
      console.log('Todo is already completed');
      return;
    }
    todo.toggleCompleted();
    storage.saveProjects(this.projects);
  }

  addProject(projectName) {
    if (this.projects.find((project) => project.name === projectName)) {
      console.error('Project with the same name already exists');
      return;
    }

    const project = new Project(projectName);
    this.projects.push(project);
    this.currentProject = project; // switch to the new project
    storage.saveProjects(this.projects);
  }

  switchProject(project) {
    this.currentProject = project;
    storage.saveProjects(this.projects);
  }

  deleteProject(project) {
    this.projects = this.projects.filter((p) => p !== project);
    if (this.currentProject === project) {
      this.currentProject = this.projects.length > 0 ? this.projects[0] : null;
    }
    storage.saveProjects(this.projects);
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