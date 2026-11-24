import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
	preprocess: vitePreprocess(),
	compilerOptions: {
		// child components inject their styles into the custom element's shadow root
		customElement: true,
	},
};
