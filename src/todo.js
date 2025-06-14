class Todo {
  constructor(title, description, dueDate, priority, notes = '', checklist = [], tags = []) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Todo title must be a non-empty string');
    }
    if (typeof description !== 'string' || description.trim() === '') {
      throw new Error('Todo description must be a non-empty string');
    }
    if (!(dueDate instanceof Date)) {
      throw new Error('Todo due date must be a valid date');
    }
    this.id = Math.floor(Math.random() * 10000);
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority; // consider using an enum or numeric value
    this.notes = notes;
    this.checklist = checklist.map((item) => ({ item, completed: false }));
    this.tags = tags;
    this.createdDate = new Date();
    this.updatedDate = new Date();
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updatePriority(priority) {
    this.priority = priority;
  }

  updateTitle(title) {
    this.title = title;
  }

  updateDescription(description) {
    this.description = description;
  }

  updateDueDate(dueDate) {
    this.dueDate = dueDate;
  }

  updateNotes(notes) {
    this.notes = notes;
  }

  addChecklistItem(item) {
    this.checklist.push({ item, completed: false });
  }

  removeChecklistItem(item) {
    const index = this.checklist.findIndex((i) => i.item === item);
    if (index !== -1) {
      this.checklist.splice(index, 1);
    }
  }

  toString() {
    return `Todo: ${this.id} - ${this.title} - ${this.description} - Due: ${this.dueDate} - Priority: ${this.priority} - Completed: ${this.completed}`;
  }

  toDetailedString() {
    return `Todo: ${this.id} - ${this.title} - ${this.description} - Due: ${this.dueDate} - Priority: ${this.priority} - Completed: ${this.completed}
Created: ${this.createdDate}
Updated: ${this.updatedDate}
Notes: ${this.notes}
Checklist: ${this.checklist.map((i) => `${i.item} (${i.completed ? 'completed' : 'pending'})`).join(', ')}
Tags: ${this.tags.join(', ')}`;
  }
}

export default Todo;