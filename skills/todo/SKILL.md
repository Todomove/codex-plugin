---
description: Manage the Todomove task delegated to this connection — list project tasks, create tasks or subtasks, mark done/not done, or change the due date.
disable-model-invocation: true
---

# Todo

Use the `todomove` MCP tools to fulfill the user's request about their Todomove
task(s). "$ARGUMENTS" describes what they want; if empty, show the currently delegated
task and the other tasks in its project.

Map intent to the right tool:

- Show the current task / what am I working on → `read_delegated_task`
- List / show tasks in this project → `list_project_tasks` (optionally filter by
  status: `todo`, `inProgress`, `done`)
- Add / create a task → `create_task` (title, optional description, optional due date
  as `YYYY-MM-DD`)
- Add a subtask / break this down → `create_subtask` (one call per subtask)
- Mark done / complete → `complete_task`
- Reopen / mark not done / undo → `uncomplete_task`
- Set / change / clear the due date → `change_due_date` (omit `due`, or pass `null`, to
  clear it)

Confirm briefly what you did (e.g. "Marked 'Fix the login bug' as done") instead of
dumping raw tool output. If a tool call fails (no active delegation, invalid due date,
task has no project to list), explain the error plainly rather than retrying blindly.
