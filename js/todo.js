'use strict';

const input = document.querySelector('.input');
const inputBox = document.querySelector('.input-box');
const pendingCount = document.querySelector('.pending-count');
const pendingTodosBox = document.querySelector('.pending-todos-box');
const completedTodosBox = document.querySelector('.completed-todos-box');
const clearButton = document.querySelector('.clear');
const hideButton = document.querySelector('.hide-completed');
const noTodos = document.querySelector('.no-todos');
let pendingItems = 0;
let todos = [];

const padNumbers = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
};

const day = document.querySelector('.day');
const dateNow = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayIndex = dateNow.getDay();
const dayName = days[dayIndex];
const date = padNumbers(dateNow.getDate());
const month = padNumbers(dateNow.getMonth() + 1);
const year = dateNow.getFullYear(); 
const formattedDate = document.querySelector('.date');
day.textContent = dayName;
formattedDate.textContent = `${month}-${date}-${year}`;

getFromLocalStorage();

inputBox.addEventListener('submit', function(ev) {
    ev.preventDefault();
    addTodos(input.value);
})

pendingTodosBox.addEventListener('click', function(ev) {
    if (ev.target.type === 'checkbox') {
        changeCompleted(parseInt(ev.target.parentElement.parentElement.getAttribute('data-id')))
    }
    if (ev.target.classList.contains('trash')) {
        deleteTodo(parseInt(ev.target.parentElement.getAttribute('data-id')));
    }
})

completedTodosBox.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('trash')) {
        deleteTodo(parseInt(ev.target.parentElement.getAttribute('data-id')));
    }
})

clearButton.addEventListener('click', () => {
    clearPendingElements();
})

hideButton.addEventListener('click', () => {
    completedTodosBox.classList.toggle('hide');
    completedTodosBox.classList.contains('hide') ? hideButton.textContent = 'Show Complete' : hideButton.textContent = 'Hide Complete';
})

function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    if (reference) {
      todos = JSON.parse(reference);
      handleCount(todos);
      createTodosElement(todos);
    }    
}

function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    createTodosElement(todos);
}

function changeCompleted(id) {
    todos.forEach( function(item) {
        if (item.id == id) {
            item.completed = !item.completed;
        }
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function deleteTodo(id) {
    todos = todos.filter( function(item) {
        return item.id !== id;
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function addTodos(item) {
    if  (Boolean(item)) {
        const todo = {
            id: Date.now(),
            name: item,
            completed: false,
        }
        todos.push(todo);
        handleCount(todos);
        addToLocalStorage(todos);
        input.value = '';
        pendingTodosBox.firstElementChild.classList.add('show-in');
    }
}

function createTodosElement(todosArray) {
    pendingTodosBox.innerHTML = '';
    completedTodosBox.innerHTML = '';
    todosArray.forEach( function(todo) {
        const checked = todo.completed ? 'checked' : null;
        const TodosBoxElement = document.createElement('div');
        TodosBoxElement.classList.add('todos');
        TodosBoxElement.setAttribute('data-id', todo.id);
        if (todo.completed) { TodosBoxElement.classList.add('checked') }
        TodosBoxElement.innerHTML = `
                <div class="input-label-box">
                    <input type="checkbox" ${checked}>
                    <label>${todo.name}</label>
                </div>
                <span class="trash"></span>`;
        todo.completed ? completedTodosBox.prepend(TodosBoxElement) : pendingTodosBox.prepend(TodosBoxElement);
    });
    const completedTitle = document.createElement('p');
    completedTitle.textContent = `Completed tasks: ${Math.round((todos.length - pendingItems) / todos.length * 100 )}%`
    completedTodosBox.prepend(completedTitle);
}

function handleCount(todos) {
    pendingItems = todos.filter(item => item.completed === false).length;
    if (pendingItems === 0) {
        timeToChill();
        pendingCount.parentElement.classList.add('hide');
    } else {
        pendingCount.parentElement.classList.remove('hide');
        noTodos.textContent = '';
        noTodos.classList.remove('chill');
        pendingCount.textContent = pendingItems;
        clearButton.classList.remove('hide');
        hideButton.classList.remove('hide');
    }
}

function clearPendingElements() {
    todos = todos.filter( function(item) {
        return item.completed === true;
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function timeToChill() {
    completedTodosBox.classList.add('hide');
    hideButton.textContent = 'Show Complete';
    noTodos.innerHTML = `<img src="./img/beers.jpg" alt="beers"><p>Time to chill! You have no todos.</p>`;
    noTodos.classList.add('chill');
    clearButton.classList.add('hide');
    hideButton.classList.add('hide');
}