import './styles.css';
import DOM from './dom.js';
import App from './app.js';

const app = new App();
const dom = new DOM(app);

// Add an event listener to handle form submissions
document.addEventListener('DOMContentLoaded', () => {
  dom.renderTodoList();
  dom.renderProjectList();
});