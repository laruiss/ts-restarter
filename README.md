# TS Restarter

This extension makes VSCode restart TS Server automatically on file (globs) change!

## TL;DR

Put this (or something like it) in the `settings.json` of the project:

```jsonc
{
  // (...)
  "ts-restarter.watch": ["./packages/shared/src/**/*.ts"], // Maybe ./packages/shared/dist/**/*.js
  "ts-restarter.ignore": ["./packages/shared/src/**/*.spec.ts"]
  // (...)
}
```

## The problem

When working on monorepo with a shared library, if one changes some files in it, one has to restart VSCode TS Server for the changes
to be reflected in the server and/or client (or other) workspace.

## The basic solutions

One can either:

- Restart VSCode (bad, don't do that)
- Reload window (almost as bad, don't do that)
- Restart TS Server manually: `Shift Ctrl p` or `Shift Cmd p`, and then search for the command TypeScript: Restart TS Server (better)
- Set a keyboard shortcut like `Ctrl K T` and use it every time something in `shared` has changed (much better)

## The solution this extension provides

The even better solution would be to let VSCode know what files to watch to restart its TS Server on any change on this specific files (with)... That is what this extension is for.

Maybe this extension is useles, if you know a better way, please tell me!

### How

Tell the extension what globs to watch (and optionnally ignore), chokidar will watch them and if a change occurs, the VSCode internal command `typescript.restartTsServer` will be executed.

## Extension Settings

This extension contributes the following settings:

- `ts-restarter.watch`: array of globs for files to watch.
- `ts-restarter.ignore`: array of globs for files to ignore.

So in your configuration (`settings.json` in the `.vscode` folder at the root of the project is recommended), put something like this:

```jsonc
{
  // (...)
  "ts-restarter.watch": ["./packages/shared/src/**/*.ts"],
  "ts-restarter.ignore": ["./packages/shared/src/**/*.spec.ts"]
  // (...)
}
```

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of TS Server
