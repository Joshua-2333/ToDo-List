import App from './app.js';

class DOM {
  /**
  *@param {App} app
  */
  
   constructor(app) {
  this.app = app;
  this.todoList = document.getElementById('todo-list');
  this.todoForm = document.getElementById('todo-form');
  this.projectList = document.getElementById('project-list');
  this.todoDetails = document.getElementById('todo-details');
  this.addProjectBtn = document.getElementById('add-project-btn');
  this.addTodoBtn = document.getElementById('add-todo-btn');
  this.todoModal = document.getElementById('todo-modal');
  this.projectNameInput = document.getElementById('project-name-input');
  this.currentTodo = null;

  this.updateTodoFormListener = (e) => {
  e.preventDefault();
  const titleInput = document.querySelector('#title');
  const descriptionInput = document.querySelector('#description');
  const dueDateInput = document.querySelector('#due-date');
  const priorityInput = document.querySelector('#priority');
  const title = titleInput.value.trim();
  const description = descriptionInput.value;
  const dueDate = new Date(dueDateInput.value); // Convert to Date object
  const priority = priorityInput.value;

  if (title.length === 0) {
    alert('Please enter a valid title');
    return;
  }

  if (this.currentTodo) {
    this.app.updateTodo(this.currentTodo, title, description, dueDate, priority);
  } else {
    this.app.createTodo(title, description, dueDate, priority);
  }
  this.renderTodoList();
  this.todoForm.reset();
  this.todoModal.style.display = 'none'; // Close the todo modal
};

this.todoForm.addEventListener('submit', this.updateTodoFormListener);
this.addProjectBtn.addEventListener('click', () => {
  const projectName = this.projectNameInput.value;
  this.handleAddProject(projectName);
  this.projectNameInput.value = '';
});
this.addTodoBtn.addEventListener('click', () => {
  this.todoModal.style.display = 'block';
  this.todoForm.style.display = 'block'; // Show the todo form when the add_todo button is clicked
});

this.renderProjectList();
this.renderTodoList();
}

   renderTodoList() {
    this.todoList.innerHTML = '';
    if (this.app.currentProject) {
      const projectHeader = document.createElement('h2');
      projectHeader.textContent = this.app.currentProject.name;
      this.todoList.appendChild(projectHeader);
    }

    if (this.app.currentProject && this.app.currentProject.todos.length === 0) {
      this.renderEmptyTodoListMessage(this.app.currentProject.name);
    } else if (this.app.currentProject) {
      this.app.currentProject.todos.forEach((todo) => {
        const todoTemplate = document.querySelector('#todo-template').content.cloneNode(true);
        const label = todoTemplate.querySelector('label');
        label.textContent = todo.title;
        const checkbox = todoTemplate.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
          const todoItem = e.target.closest('li');
          if (e.target.checked) {
            todoItem.querySelector('label').style.textDecoration = 'line-through';
            todoItem.querySelector('.todo-description').style.textDecoration = 'line-through';
            todoItem.querySelector('.due-date').style.textDecoration = 'line-through';
          } else {
            todoItem.querySelector('label').style.textDecoration = 'none';
            todoItem.querySelector('.todo-description').style.textDecoration = 'none';
            todoItem.querySelector('.due-date').style.textDecoration = 'none';
          }
        });
        const description = todoTemplate.querySelector('.todo-description');
        description.textContent = todo.description;
        const dueDateSpan = todoTemplate.querySelector('.due-date');
        const date = new Date(todo.dueDate);
        const day = date.getDate() + 1; // Add 1 to the day
        const month = date.getMonth() + 1;
        dueDateSpan.textContent = `${month}/${day}/${date.getFullYear()}`; // Format date to MM/DD/YYYY
        const deleteButton = todoTemplate.querySelector('.delete-todo-button');
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const todoListItem = deleteButton.closest('li'); // Get the parent li element
          const todoId = parseInt(todoListItem.getAttribute('data-id')); // Convert todoId to a number
          // Remove the todo item from the app's data
          this.app.deleteTodo(todo); // Pass the todo object instead of id
          // Remove the list item from the DOM
          todoListItem.remove();
        });
        const editButton = todoTemplate.querySelector('#Edit-todo-button');
        editButton.addEventListener('click', () => this.handleUpdateTodo(todo));
        this.todoList.appendChild(todoTemplate);
      });
    }
  }


renderEmptyTodoListMessage(projectName) {
  const projectHeader = document.createElement('h2');
  projectHeader.textContent = projectName;
  this.todoList.innerHTML = '';
  this.todoList.appendChild(projectHeader);
  const noTodosMessage = document.createElement('p');
  noTodosMessage.textContent = 'No todos in this project';
  this.todoList.appendChild(noTodosMessage);
}

    renderProjectList() {
  this.projectList.innerHTML = '';
  if (this.app.projects.length === 0) {
    this.projectList.innerHTML = '<p>No projects</p>';
  } else {
    this.app.projects.forEach((project) => {
      const projectTemplate = document.querySelector('#project-template').content.cloneNode(true);
      const label = projectTemplate.querySelector('label');
      label.textContent = project.name;
      label.addEventListener('click', () => this.handleSwitchProject(project)); // Add event listener to label
      const deleteButton = projectTemplate.querySelector('#Delete-project-button');
      deleteButton.addEventListener('click', () => this.handleDeleteProject(project));
      const editButton = projectTemplate.querySelector('#Edit-project-button');
      editButton.addEventListener('click', () => this.handleEditProject(project));
      this.projectList.appendChild(projectTemplate);
    });
  }
}

   handleAddProject(projectName) {
    if (projectName) {
      this.app.addProject(projectName);
      this.renderProjectList();
    }
  }


handleSwitchProject(project) {
  this.app.switchProject(project);
  this.app.domInstance = this; // Set the domInstance property
  this.renderTodoList();
}

handleDeleteProject(project) {
  this.app.deleteProject(project);
  this.renderProjectList();
  this.renderTodoList(); // Call this method regardless of currentProject
}

handleEditProject(project) {
  const projectName = prompt('Enter new project name:', project.name);
  if (projectName === null) {
    alert('Please enter a valid project name');
    return;
  }
  this.app.updateProject(project, projectName);
  this.renderProjectList();
  this.renderTodoList(); // Add this line to update the todo list
}

handleFormSubmission(e) {
  if (e.target !== this.todoForm) {
    return;
  }
  e.preventDefault();
  const titleInput = document.querySelector('#title');
  const descriptionInput = document.querySelector('#description');
  const dueDateInput = document.querySelector('#due-date');
  const priorityInput = document.querySelector('#priority');

  const modal = document.getElementById('todo-modal');

  if (modal.style.display !== 'block') {
    console.log('Modal is not visible');
    return;
  }

  const title = titleInput.value.trim();
  console.log('Title:', title);

  if (!title) {
    alert('Please enter a valid title');
    return;
  }

  const description = descriptionInput.value;
  const dueDate = new Date(dueDateInput.value); // Convert to Date object
  const priority = priorityInput.value;

  if (this.currentTodo) {
    this.app.updateTodo(this.currentTodo, title, description, dueDate, priority);
  } else {
    this.app.createTodo(title, description, dueDate, priority);
  }
  this.renderTodoList();
  this.todoForm.reset();
  this.todoModal.style.display = 'none'; // Close the todo modal
  this.currentTodo = null; // Reset the currentTodo property
}

handleTodoClick(todo) {
  if (this.todoDetails && this.todoDetails.innerHTML !== '') {
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
    <button id="Delete-todo-button" class="icon">
      <span class="material-icons">delete</span>
    </button>
    <button id="update-todo">Update Todo</button>
  `;

  this.todoDetails.innerHTML = todoDetailsTemplate;

  document.getElementById('Delete-todo-button').addEventListener('click', () => this.handleDeleteTodo(todo));
  document.getElementById('update-todo').addEventListener('click', () => this.handleUpdateTodo(todo));
}

handleDeleteTodo(todo) {
  const todoListItem = document.querySelector(`li[data-id="${todo.id}"]`);
  if (todoListItem) {
    todoListItem.remove();
  }
  this.app.domInstance = this; // Set the domInstance property
  this.app.deleteTodo(todo); // Pass the todo object instead of id
  this.renderTodoList();
}

handleUpdateTodo(todo) {
  this.currentTodo = todo;
  this.todoModal.style.display = 'block';
  this.todoForm.style.display = 'block';
  const titleInput = document.querySelector('#title');
  const descriptionInput = document.querySelector('#description');
  const dueDateInput = document.querySelector('#due-date');
  const priorityInput = document.querySelector('#priority');

  titleInput.value = todo.title;
  descriptionInput.value = todo.description;
  dueDateInput.value = todo.dueDate;
  priorityInput.value = todo.priority;
}

handleToggleTodoCompleted(todo) {
  todo.toggleCompleted();
  this.app.toggleTodoCompleted(todo);
  this.renderTodoList();
}
}

export default DOM;