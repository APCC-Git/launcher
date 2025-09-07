import type { App } from "../types/App";

let apps: App[];

if (import.meta.env.MODE === "development") {
  apps = (await import("./apps.dev")).apps;
} else {
  apps = (await import("./apps.prod")).apps;
}

const launcherSettings = {
  title: "APCC 2025ゲームCDランチャー",
};

export { apps, launcherSettings };
