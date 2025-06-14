// dom.js
import App from './app.js';

class DOM {
  constructor(app) {
    this.app = app;
    this.todoList = document.getElementById('todo-list');
    this.todoForm = document.getElementById('todo-form');
    this.projectList = document.getElementById('project-list');
    this.todoDetails = document.getElementById('todo-details');

    this.todoForm.addEventListener('submit', (e) => this.handleFormSubmission(e));

    this.renderProjectList();
    this.renderTodoList();
  }

  renderTodoList() {
    this.todoList.innerHTML = '';
    if (this.app.currentProject.todos.length === 0) {
      this.renderEmptyTodoListMessage();
    } else {
      this.app.currentProject.todos.forEach((todo) => {
        const todoElement = document.createElement('li');
        todoElement.textContent = todo.title;
        todoElement.addEventListener('click', () => this.handleTodoClick(todo));
        this.todoList.appendChild(todoElement);
      });
    }
  }

  renderEmptyTodoListMessage() {
    this.todoList.innerHTML = '<p>No todos in this project</p>';
  }

  renderProjectList() {
    this.projectList.innerHTML = '';
    if (this.app.projects.length === 0) {
      this.projectList.innerHTML = '<p>No projects</p>';
    } else {
      this.app.projects.forEach((project) => {
        const projectElement = document.createElement('li');
        projectElement.textContent = project.name;
        projectElement.addEventListener('click', () => this.handleSwitchProject(project));
        projectElement.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.handleDeleteProject(project);
        });
        this.projectList.appendChild(projectElement);
      });

      const addProjectButton = document.createElement('button');
      addProjectButton.textContent = 'Add New Project';
      addProjectButton.addEventListener('click', () => this.handleAddProject());
      this.projectList.appendChild(addProjectButton);
    }
  }

  handleAddProject() {
    const projectName = prompt('Enter new project name:');
    if (projectName) {
      this.app.addProject(projectName);
      this.renderProjectList();
    }
  }

  handleSwitchProject(project) {
    this.app.switchProject(project);
    this.renderTodoList();
  }

  handleDeleteProject(project) {
    this.app.deleteProject(project);
    this.renderProjectList();
    this.renderTodoList();
  }

  handleFormSubmission(e) {
    e.preventDefault();
    const titleInput = document.querySelector('#title');
    const descriptionInput = document.querySelector('#description');
    const dueDateInput = document.querySelector('#due-date');
    const priorityInput = document.querySelector('#priority');

    const title = titleInput.value.trim();
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (title.length === 0) {
      alert('Please enter a valid title');
      return;
    }

    this.app.createTodo(title, description, dueDate, priority);
    this.renderTodoList();
    this.todoForm.reset();
  }

  handleTodoClick(todo) {
    if (this.todoDetails.innerHTML !== '') {
      this.todoDetails.innerHTML = '';
    }
    this.displayTodoDetails(todo);
  }

  displayTodoDetails(todo) {
    const todoDetailsTemplate = `
      <h2>${todo.title}</h2>
      <p>${todo.description}</p>
      <p>Due Date: ${todo.dueDate}</p>
      <p>Priority: ${todo.priority}</p>
      <button id="delete-todo">Delete Todo</button>
      <button id="update-todo">Update Todo</button>
    `;

    this.todoDetails.innerHTML = todoDetailsTemplate;

    document.getElementById('delete-todo').addEventListener('click', () => this.handleDeleteTodo(todo));
    document.getElementById('update-todo').addEventListener('click', () => this.handleUpdateTodo(todo));
  }

  handleDeleteTodo(todo) {
    this.app.deleteTodo(todo);
    this.renderTodoList();
    this.todoDetails.innerHTML = '';
  }

  handleUpdateTodo(todo) {
    const title = prompt('Enter new title:', todo.title);
    const description = prompt('Enter new description:', todo.description);
    const dueDate = prompt('Enter new due date:', todo.dueDate);
    const priority = prompt('Enter new priority:', todo.priority);

    if (title === null || description === null || dueDate === null || priority === null) {
      alert('Please enter valid values');
      return;
    }

    this.app.updateTodo(todo, title, description, dueDate, priority);
    this.renderTodoList();
    this.displayTodoDetails(todo);
  }
}

export default DOM;
