const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "tasks.json");

async function loadTasks() {
	try {
		const data = await fs.readFile(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
}

async function saveTasks(tasks) {
	function filepath() {
		
	}

	await fs.writeFile(filepath, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
