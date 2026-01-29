#!/usr/bin/env node
const {
	addTask,
	listTasks,
	markDone,
	deleteTask,
} = require("./src/taskService");

function printHelp() {
	console.log(`
Task Tracker CLI

Usage:
  node index.js add "Buy milk" --priority high
  node index.js list
  node index.js list --completed
  node index.js list --pending
  node index.js list --priority high|medium|low
  node index.js done <id>
  node index.js delete <id>

Examples:
  node index.js add "Learn JS arrays" --priority medium
  node index.js list --pending
  node index.js done 2
`);
}

function parseCommand(argv) {
	// PROVIDED: students do not need to touch this
	const args = argv.slice(2);
	const command = args[0];

	const flags = {};
	const positionals = [];

	for (let i = 1; i < args.length; i++) {
		const t = args[i];
		if (t.startsWith("--")) {
			const key = t.slice(2);
			const next = args[i + 1];
			if (!next || next.startsWith("--")) {
				flags[key] = true;
			} else {
				flags[key] = next;
				i++;
			}
		} else {
			positionals.push(t);
		}
	}

	return { command, flags, positionals };
}

async function main() {
	const { command, flags, positionals } = parseCommand(process.argv);

	if (!command || command === "help" || command === "--help" || command === "-h") {
		printHelp();
		return;
	}

	try {
		if (command === "add") {
			const title = positionals.join(" ").trim();
			const priority = (flags.priority || "medium").toLowerCase();

			if (!title) {
				console.log('❌ Missing title. Example: node index.js add "Buy milk" --priority high');
				return;
			}

			const created = await addTask(title, priority);
			console.log(`✅ Added #${created.id}: "${created.title}" [${created.priority}]`);
			return;
		}

		if (command === "list") {
			const filter = {
				status: flags.completed ? "completed" : flags.pending ? "pending" : "all",
				priority: flags.priority ? String(flags.priority).toLowerCase() : null,
			};

			const tasks = await listTasks(filter);

			if (tasks.length === 0) {
				console.log("No tasks found.");
				return;
			}

			console.log("Tasks:");
			for (const t of tasks) {
				console.log(
					`#${t.id} | ${t.completed ? "✅ done" : "⏳ pending"} | ${t.priority} | ${t.title}`
				);
			}
			return;
		}

		if (command === "done") {
			const id = Number(positionals[0]);
			if (!Number.isFinite(id)) {
				console.log("❌ Invalid id. Example: node index.js done 2");
				return;
			}

			const updated = await markDone(id);
			console.log(`✅ Completed #${updated.id}: "${updated.title}"`);
			return;
		}

		if (command === "delete") {
			const id = Number(positionals[0]);
			if (!Number.isFinite(id)) {
				console.log("❌ Invalid id. Example: node index.js delete 2");
				return;
			}

			const removed = await deleteTask(id);
			console.log(`🗑️ Deleted #${removed.id}: "${removed.title}"`);
			return;
		}

		console.log(`❌ Unknown command: ${command}`);
		printHelp();
	} catch (err) {
		console.log(`❌ Error: ${err.message}`);
	}
}

main();
