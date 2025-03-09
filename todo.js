class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.addButton = document.getElementById('add-btn');
        
        this.init();
        this.render();
    }

    init() {
        // Add todo on button click
        this.addButton.addEventListener('click', () => this.addTodo());
        
        // Add todo on Enter key
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            this.todos.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            this.todoInput.value = '';
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        this.todoList.innerHTML = '';
        
        if (this.todos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <p>No tasks yet! Add a new task to get started.</p>
                </div>
            `;
            return;
        }

        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.text}</span>
                <button class="delete-btn">×</button>
            `;
            
            // Add event listeners
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            this.todoList.appendChild(li);
        });
    }
}

new TodoList();
