class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.init();
    }

    init() {
        this.render();
        document.getElementById('add-btn').addEventListener('click', () => this.addTodo());
        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        if (text) {
            this.todos.push({ text, completed: false });
            input.value = '';
            this.save();
            this.render();
        }
    }

    render() {
        const list = document.getElementById('todo-list');
        list.innerHTML = this.todos.length > 0 ? 
            this.todos.map((todo, index) => `
                <li class="todo-item">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                        data-index="${index}" class="todo-check">
                    <span style="${todo.completed ? 'text-decoration: line-through; opacity: 0.7' : ''}">
                        ${todo.text}
                    </span>
                    <button data-index="${index}" class="delete-btn">×</button>
                </li>
            `).join('') : 
            '<div class="empty-state">No tasks yet! Add your first task 🌟</div>';

        document.querySelectorAll('.todo-check').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleTodo(e.target.dataset.index));
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => this.deleteTodo(e.target.dataset.index));
        });
    }

    toggleTodo(index) {
        this.todos[index].completed = !this.todos[index].completed;
        this.save();
        this.render();
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
        this.save();
        this.render();
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

new TodoList();
