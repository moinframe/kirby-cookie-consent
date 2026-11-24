/// <reference types="vitest/config" />

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		// not library mode: that keeps whitespace in ES output, but this file is served as-is
		rolldownOptions: {
			input: resolve(root, "src/main.ts"),
			output: {
				entryFileNames: "cookie-consent.js",
			},
		},
		outDir: resolve(root, "../assets"),
		emptyOutDir: true,
	},
	plugins: [svelte()],
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
