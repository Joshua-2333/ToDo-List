// storage.js
import Project from './project';
import Todo from './todo';

const storage = {
  /**
   * Saves an array of projects to local storage.
   * @param {Project[]} projects - The array of projects to save.
   */
  saveProjects(projects) {
    try {
      const serializedProjects = projects.map((project) => ({
        name: project.name,
        id: project.id,
        todos: project.todos.map((todo) => ({
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate.toISOString(), // convert Date to ISO string
          priority: todo.priority,
          notes: todo.notes,
          checklist: todo.checklist,
          completed: todo.completed,
        })),
      }));
      localStorage.setItem('projects', JSON.stringify(serializedProjects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  },

  /**
   * Loads an array of projects from local storage.
   * @returns {Project[]} The loaded array of projects.
   */
  loadProjects() {
    try {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const deserializedProjects = JSON.parse(storedProjects);
        return deserializedProjects.map((project) => {
          const newProject = new Project(project.name);
          newProject.id = project.id;
          newProject.todos = project.todos.map((todo) => {
            const dueDate = todo.dueDate ? new Date(todo.dueDate) : new Date(); // default to current date if dueDate is missing
            if (!isNaN(dueDate.getTime())) {
              return new Todo(
                todo.title,
                todo.description,
                dueDate,
                todo.priority,
                todo.notes,
                todo.checklist,
                todo.completed, // add completed property
              );
            } else {
              console.error('Invalid due date:', todo.dueDate);
              return null; // or some default Todo object
            }
          }).filter(Boolean); // remove null values
          return newProject;
        });
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  },

  /**
   * Clears all data from local storage.
   */
  clearStorage() {
    localStorage.clear();
  },
};

export default storage;