'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.input.value = '';
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(item) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `
            <span class="text-todo">${item.value}</span>
            <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
            </div>`;
        if (item.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
        }
        this.render();
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    deleteItem(target) {
        const todoItem = document.querySelectorAll('.todo-item'); //this.todoItem === void
        todoItem.forEach(item => {
            const btnRemoveItem = item.querySelector('.todo-remove');
            if (btnRemoveItem === target) {
                this.todoData.forEach(elem => {
                    if (elem.value === item.textContent.trim()) {
                        this.todoData.delete(elem.key);
                    }
                });
            }
        });
        this.render();
    }

    completedItem(target) {
        const todoItem = document.querySelectorAll('.todo-item');
        todoItem.forEach(item => {
            const btnComplItem = item.querySelector('.todo-complete');
            if (btnComplItem === target) {
                this.todoData.forEach(elem => {
                    if (elem.value === item.textContent.trim()) {
                        elem.completed = !elem.completed;
                    }
                });
            }
        });
        this.render();
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', event => {
            const target = event.target;
            if (target.matches('.todo-remove')) {
                this.deleteItem(target);
            }
            if (target.matches('.todo-complete')) {
                this.completedItem(target);
            }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();