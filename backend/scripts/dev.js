import { readdirSync, statSync, watchFile, unwatchFile } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const SRC_DIR = path.resolve("src");
const ENTRY_FILE = path.join(SRC_DIR, "server.js");
const WATCH_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".json"]);
const watchedFiles = new Map();

let childProcess = null;
let isRestarting = false;
let rescanTimer = null;

function collectSourceFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(entryPath));
      continue;
    }

    if (WATCH_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function startServer() {
  childProcess = spawn(process.execPath, [ENTRY_FILE], {
    stdio: "inherit",
    env: process.env,
  });

  childProcess.on("exit", (code, signal) => {
    if (isRestarting) {
      return;
    }

    if (signal) {
      console.log(`Server stopped with signal ${signal}`);
      return;
    }

    if (code !== 0) {
      console.log(`Server exited with code ${code}`);
    }
  });
}

function restartServer(reason) {
  if (isRestarting) {
    return;
  }

  isRestarting = true;
  console.log(`Restarting server (${reason})...`);

  if (!childProcess) {
    startServer();
    isRestarting = false;
    return;
  }

  childProcess.once("exit", () => {
    startServer();
    isRestarting = false;
  });

  childProcess.kill("SIGTERM");
}

function watchSourceFile(filePath) {
  watchFile(filePath, { interval: 500 }, (current, previous) => {
    if (current.mtimeMs !== previous.mtimeMs) {
      restartServer(path.relative(SRC_DIR, filePath));
    }
  });

  watchedFiles.set(filePath, true);
}

function syncWatchers({ restartOnAdd = true } = {}) {
  const currentFiles = new Set(collectSourceFiles(SRC_DIR));

  for (const filePath of currentFiles) {
    if (!watchedFiles.has(filePath)) {
      watchSourceFile(filePath);
      if (restartOnAdd) {
        restartServer(`detected ${path.relative(SRC_DIR, filePath)}`);
      }
    }
  }

  for (const filePath of watchedFiles.keys()) {
    if (!currentFiles.has(filePath)) {
      unwatchFile(filePath);
      watchedFiles.delete(filePath);
      restartServer(`removed ${path.relative(SRC_DIR, filePath)}`);
    }
  }
}

function cleanupAndExit(signal) {
  clearInterval(rescanTimer);

  for (const filePath of watchedFiles.keys()) {
    unwatchFile(filePath);
  }

  if (childProcess) {
    childProcess.kill(signal);
  }

  process.exit(0);
}

syncWatchers({ restartOnAdd: false });
startServer();
rescanTimer = setInterval(syncWatchers, 1000);

process.on("SIGINT", () => cleanupAndExit("SIGINT"));
process.on("SIGTERM", () => cleanupAndExit("SIGTERM"));
