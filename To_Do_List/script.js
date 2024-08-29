document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('save-tasks-btn').addEventListener('click', saveTasks);
document.getElementById('share-list-btn').addEventListener('click', shareTasks);
document.getElementById('theme-toggle').addEventListener('change', toggleTheme);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const categorySelect = document.getElementById('category-select');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date');

    const taskText = taskInput.value.trim();
    const category = categorySelect.value.trim();
    const priority = prioritySelect.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    }

    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.draggable = true;

    // Checkbox para marcar como concluído
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
    });

    // Campo de texto para a tarefa
    const taskInputField = document.createElement('input');
    taskInputField.type = 'text';
    taskInputField.value = taskText;
    taskInputField.readOnly = true;

    // Informações adicionais da tarefa
    const taskCategory = document.createElement('span');
    taskCategory.className = 'task-category';
    taskCategory.innerText = category;

    const taskPriority = document.createElement('span');
    taskPriority.className = 'task-priority';
    taskPriority.innerText = priority;

    const taskDueDate = document.createElement('span');
    taskDueDate.className = 'task-due-date';
    taskDueDate.innerText = dueDate;

    // Contêiner para ações (Editar, Excluir)
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    // Botão de Editar
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerText = 'Editar';
    editBtn.addEventListener('click', () => {
        if (taskInputField.readOnly) {
            taskInputField.readOnly = false;
            editBtn.innerText = 'Salvar';
        } else {
            taskInputField.readOnly = true;
            editBtn.innerText = 'Editar';
        }
    });

    // Botão de Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = 'Excluir';
    deleteBtn.addEventListener('click', () => {
        taskItem.remove();
    });

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskInputField);
    taskItem.appendChild(taskCategory);
    taskItem.appendChild(taskPriority);
    taskItem.appendChild(taskDueDate);
    taskItem.appendChild(taskActions);

    taskList.appendChild(taskItem);

    // Limpa os campos após a adição da tarefa
    taskInput.value = '';
    categorySelect.value = '';
    prioritySelect.value = 'Média';
    dueDateInput.value = '';

    addDragAndDrop(taskItem);
}

function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const taskText = item.querySelector('input[type="text"]').value;
        const category = item.querySelector('.task-category').innerText;
        const priority = item.querySelector('.task-priority').innerText;
        const dueDate = item.querySelector('.task-due-date').innerText;

        tasks.push({ taskText, category, priority, dueDate });
    });

    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
}

function shareTasks() {
    const taskItems = document.querySelectorAll('.task-item');
    let taskList = '';

    taskItems.forEach(item => {
        const taskText = item.querySelector('input[type="text"]').value;
        const category = item.querySelector('.task-category').innerText;
        const priority = item.querySelector('.task-priority').innerText;
        const dueDate = item.querySelector('.task-due-date').innerText;

        taskList += `Tarefa: ${taskText}\nCategoria: ${category}\nPrioridade: ${priority}\nData de Vencimento: ${dueDate}\n\n`;
    });

    navigator.clipboard.writeText(taskList).then(() => {
        alert('Lista copiada para a área de transferência!');
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function addDragAndDrop(taskItem) {
    taskItem.addEventListener('dragstart', dragStart);
    taskItem.addEventListener('dragover', dragOver);
    taskItem.addEventListener('drop', drop);
    taskItem.addEventListener('dragend', dragEnd);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    e.target.closest('ul').insertBefore(draggable, e.target);
    e.target.classList.remove('drag-over');
}

function dragEnd(e) {
    e.target.classList.remove('hide');
    document.querySelectorAll('.task-item').forEach(item => item.classList.remove('drag-over'));
}
a