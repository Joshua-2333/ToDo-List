import './styles.css';
import DOM from './dom.js';
import App from './app.js';

const app = new App();
const dom = new DOM(app);

// Add an event listener to handle form submissions
document.addEventListener('DOMContentLoaded', () => {
  dom.renderTodoList();
  dom.renderProjectList();
  const addProjectBtn = document.getElementById('add-project-btn');
  const projectNameInput = document.getElementById('project-name-input');
  if (addProjectBtn && projectNameInput) {
    addProjectBtn.addEventListener('click', () => {
      const projectName = projectNameInput.value;
      dom.handleAddProject(projectName);
      projectNameInput.value = '';
    });
  } else {
    console.error('Element with id "add-project-btn" or "project-name-input" not found');
  }

  // Add an event listener to handle edit button clicks
  const todoList = document.getElementById('todo-list');
  if (todoList) {
    todoList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const todoId = e.target.dataset.todoId;
        dom.handleUpdateTodo(todoId);
      }
    });
  } else {
    console.error('Element with id "todo-list" not found');
  }
});