# todomove (Codex plugin)

Reports session lifecycle to Todomove — `UserPromptSubmit` → `running`,
`PermissionRequest` → `requestPermission`, `Stop` → `needReview`.

## Install

```
/plugin marketplace add Todomove/codex-plugin
/plugin install todomove@todomove-codex-plugin
```

Then write `~/.todomove/config.json` with your connector token:

```json
{ "token": "tdm_..." }
```

Add the Todomove MCP server to your own Codex config separately — not bundled yet.

## Commands

```
/todomove:todo
```

List/create/complete tasks or subtasks, or change a due date, in plain language.

## License

MIT — see `LICENSE`.
