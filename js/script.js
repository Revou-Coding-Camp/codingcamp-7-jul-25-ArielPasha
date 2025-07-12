document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const historyList = document.getElementById('historyList');
    const markAllCompletedBtn = document.getElementById('markAllCompleted');
    const deleteAllTasksBtn = document.getElementById('deleteAllTasks');
    const clearHistoryBtn = document.getElementById('clearHistory');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let history = JSON.parse(localStorage.getItem('history')) || [];

    renderTasks();
    renderHistory();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
        }
    });
    markAllCompletedBtn.addEventListener('click', markAllCompleted);
    deleteAllTasksBtn.addEventListener('click', deleteAllTasks);
    clearHistoryBtn.addEventListener('click', clearHistory);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Masukkan deskripsi tugas terlebih dahulu!');
            return;
            }

        const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: new Date().toLocaleString()
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">Tidak ada tugas. Tambahkan tugas baru!</li>';
            return;
        }

        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date}</span>
                <button class="task-delete">Hapus</button>
                `;

            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.task-delete');

            checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(taskItem);
        });
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<li class="no-tasks">Belum ada riwayat tugas</li>';
            return;
        }

        historyList.innerHTML = '';
        history.forEach(item => {
            const historyItem = document.createElement('li');
            historyItem.className = `history-item ${item.completed ? 'completed' : ''}`;

            historyItem.innerHTML = `
                <span class="history-item-text">${item.text}</span>
                <span class="history-item-date">${item.date}</span>
                <button class="history-item-delete">Hapus</button>
                `;

            const deleteBtn = historyItem.querySelector('.history-item-delete');
            deleteBtn.addEventListener('click', () => deleteHistoryItem(item.id));

            historyList.appendChild(historyItem);
        });
    }

    function toggleTaskComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = !task.completed;
                        
                if (task.completed) {
                    history.unshift({
                        id: task.id,
                        text: task.text,
                        completed: true,
                        date: task.date
                    });
                    saveHistory();
                    renderHistory();
                }
            }
            return task;
        });

        saveTasks();
        renderTasks();
    }

    function deleteTask(taskId) {
        // Add to history before deleting
        const taskToDelete = tasks.find(task => task.id === taskId);
        if (taskToDelete) {
            history.unshift({
                id: taskToDelete.id,
                text: taskToDelete.text,
                completed: false,
                date: taskToDelete.date,
                deletedAt: new Date().toLocaleString()
            });
            saveHistory();
            renderHistory();
        }

        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function deleteHistoryItem(itemId) {
        history = history.filter(item => item.id !== itemId);
        saveHistory();
        renderHistory();
    }

    function markAllCompleted() {
        tasks = tasks.map(task => {
            if (!task.completed) {
                history.unshift({
                    id: task.id,
                    text: task.text,
                    completed: true,
                    date: task.date
                });
            }
            return {...task, completed: true};
        });

        saveTasks();
        saveHistory();
        renderTasks();
        renderHistory();
    }

    function deleteAllTasks() {
        if (tasks.length === 0) {
            alert('Tidak ada tugas untuk dihapus!');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
            // Add all to history before deleting
            tasks.forEach(task => {
                history.unshift({
                    id: task.id,
                    text: task.text,
                    completed: false,
                    date: task.date,
                    deletedAt: new Date().toLocaleString()
                });
            });

            tasks = [];
            saveTasks();
            saveHistory();
            renderTasks();
            renderHistory();
        }
    }

    function clearHistory() {
        if (history.length === 0) {
            alert('Riwayat sudah kosong!');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
            history = [];
            saveHistory();
            renderHistory();
        }
    }
function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function saveHistory() {
        localStorage.setItem('history', JSON.stringify(history));
    }
});
