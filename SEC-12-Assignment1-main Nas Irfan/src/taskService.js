const { loadTasks, saveTasks } = require("./taskRepository");

const ALLOWED_PRIORITIES = ["low", "medium", "high"];

function normalizePriority(priority) {
	const p = String(priority || "medium").toLowerCase();
	if (!ALLOWED_PRIORITIES.includes(p)) {
		throw new Error('Invalid priority. Use: "low", "medium", "high".');
	}
	return p;
}

function getNextId(tasks) {
	if (tasks.length === 0) return 1;
	return Math.max(...tasks.map(t => t.id)) + 1;
}

async function addTask(title, priority) {
	const tasks = await loadTasks();

	const task ={
		id: getNextId(tasks),
		title,
		completed: false,
		priority: normalizePriority(priority),
		createdAt: new Date().toISOString(),
	};

	const updated = [...tasks, task];
	await saveTasks(updated);
	return task;
}

async function listTasks(filter = {}) {
	let tasks = await loadTasks();

	if (filter.status === 'completed') {
		tasks = tasks.filter(t => t.completed);
	}
	if (filter.status === 'pending') {
		tasks = tasks.filter(t => !t.completed);
	}
	if (filter.priority) {
		tasks = tasks.filter(t => t.priority === filter.priority);
	}

	return tasks.sort((a, b) => a.id - b.id);
}

async function markDone(id) {
	const tasks = await loadTasks();
	let updatedTask = null;

	const updated = tasks.map(t => {
		if (t.id === id) {
			updatedTask = { ...t, completed: true };
			return updatedTask;
		}
		return t;
	});

	await saveTasks(updated);
	return updatedTask;
}

async function deleteTask(id) {
	const tasks = await loadTasks();
	const task = tasks.find(t => t.id === id);
	const updated = tasks.filter(t => t.id !== id);

	await saveTasks(updated);
	return task;
}

module.exports = { addTask, listTasks, markDone, deleteTask };
