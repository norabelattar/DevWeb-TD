const USER_ID = "29b56a69-4132-4318-ac25-5d089d4d52e6";
const API_BASE_URL = "https://glo3102lab4.herokuapp.com";

const TaskController = {
    // GET qui permet d'aller chercher les taches d'un utilisateur
    async getTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/${USER_ID}/tasks`);
            if(!response.ok) throw new Error('Une erreur est survenue lors du GET pour les taches');
            return await response.json();
        } catch(error) {
            console.error('Une erreur est survenue: ', error);
            return [];
        }
    },

    // POST qui permet de creer une nouvelle tache
    async createTask(taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${USER_ID}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: taskData.name
                })
            });
            if(!response.ok) throw new Error('Une erreur est survenue lros du POST pour creer une tache');
            return await response.json();
        } catch(error) {
            console.error('Une erreur est survenue', error);
            return null;
        }
    },

    // PUT qui permet de mettre a jour le nom d'une tache
    async updateTask(taskId, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${USER_ID}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // name: taskData.name
                    ...taskData
                })
            });
            if(!response.ok) throw new Error('Une erreur est survenur lors du PUT');
            return await response.json();
        } catch(error) {
            console.error('Une erreur est survenue lors de la mise a jour', error);
            return null;
        }
    },

    // DELETE qui permet de supprimer une tache
    async deleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${USER_ID}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok) throw new Error('Une erreur est survenue lors du DELETE');
            return true;
        } catch(error) {
            console.error('Une erreur est survenue lors de la suppression', error);
            return false;
        }
    }
}

let tasks = [];

// Methode invoquer par le HTML pour ajouter une tache
// Celle ci appelle l'API pour la creer
async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if(text === '') return;

    const newTask = {
        name: text
    }

    const createdTask = await TaskController.createTask(newTask);
    
    if(createdTask) {
        tasks.push(createdTask);
        renderTasks();
        input.value = '';
    }
}

// Methode invoquer par le event listener au debut que le domain soit loade
// Celle ci appelle l'API pour aller chercher les valeurs
async function loadTasks() {
    const retrievedTasks = await TaskController.getTasks();
    tasks = retrievedTasks.tasks;
    renderTasks();
};

// Methode qui permet d'afficher visuellement les taches
function renderTasks() {
    const inProgressContainer = document.getElementById('inProgressTasks');
    const completedContainer = document.getElementById('completedTasks'); //Ignorer pour l'instant

    inProgressContainer.innerHTML = '';
    completedContainer.innerHTML = ''; //Ignorer pour l'instant

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        inProgressContainer.appendChild(taskElement);
    });
};

// Methode qui permet d'afficher visuellement chacune des taches
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.dataset.id = task.id;

    div.innerHTML = `
        <div class="task-content">
            <span class="task-text">${task.name}</span>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask('${task.id}')">✏️</button>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">🗑️</button>
            </div>
        </div>
    `;

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    return div;
}

// Methode invoquer par le HTML pour changer le nom d'une tache
// Celle ci appelle l'API pour la mettre a jour
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if(!task) return;

    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    const taskContent = taskElement.querySelector('.task-content');

    taskContent.innerHTML = `
        <div class="edit-mode">
            <input type="text" value="${task.name}" id="editInput${taskId}">
            <button onclick="saveTask('${taskId}')">💾</button>
            <button onclick="renderTasks()">❌</button>
        </div>
    `;

    document.getElementById(`editInput${taskId}`).focus();
}

// Methode invoquer par le HTML pour sauvegarder le nom d'une tache
// Celle ci appelle l'API pour la mettre a jour
async function saveTask(taskId) {
    const input = document.getElementById(`editInput${taskId}`);
    const newName = input.value.trim();

    if(newName === '') return;
    const task = tasks.find(t => t.id === taskId);
    const updatedTask = await TaskController.updateTask(taskId, {
        ...task,
        name: newName
    });

    if(updatedTask) {
        const index = tasks.findIndex(t => t.id === taskId);
        tasks[index] = updatedTask;
        renderTasks();
    }
}

// Methode invoquer par le HTML pour supprimer une tache
// Celle ci appelle l'API pour la supprimer
async function deleteTask(taskId) {
    const success = await TaskController.deleteTask(taskId);

    if(success) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
    }
}


// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Permettre d'ajouter une tâche avec Enter
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Configurer le drag and drop
    setupDragAndDrop();

    // Charger les tâches
    loadTasks();
});


let draggedElement = null;
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function setupDragAndDrop() {
    const boards = document.querySelectorAll('.board');
    boards.forEach(board => {
        board.addEventListener('dragover', handleDragOver);
        board.addEventListener('drop', handleDrop);
        board.addEventListener('dragleave', handleDragLeave);
    })
};

function handleDragOver(e) {
    if(e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

async function handleDrop(e) {
    if(e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('drag-over');
    const taskId = draggedElement.dataset.id;
    const task = tasks.find(t => t.id === taskId);

    if(this.id === 'completedBoard') {
        await deleteTask(taskId);
    }

    return false;
}

