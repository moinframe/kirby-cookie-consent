<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		variant?: "primary" | "secondary" | "ghost";
		onclick: () => void;
		children: Snippet;
	}

	let { variant = "secondary", onclick, children }: Props = $props();
</script>

<button type="button" class={variant} part="button {variant}" {onclick}>
	{@render children()}
</button>

<style>
	button {
		display: block;
		box-sizing: border-box;
		width: 100%;
		min-height: 2.75em;
		margin: 0;
		padding: 0.5em 1em;
		border: 1px solid var(--_secondary);
		border-radius: 0.2em;
		background-color: var(--_secondary);
		color: var(--_secondary-invert);
		font: inherit;
		cursor: pointer;
		transition:
			background-color 0.15s ease-in,
			border-color 0.15s ease-in,
			color 0.15s ease-in;
	}

	button:hover {
		border-color: var(--_secondary-dark);
		background-color: var(--_secondary-dark);
		color: var(--_secondary-dark-invert);
	}

	button:focus-visible {
		outline: 2px solid var(--_focus);
		outline-offset: 2px;
	}

	.primary {
		border-color: var(--_primary);
		background-color: var(--_primary);
		color: var(--_primary-invert);
	}

	.primary:hover {
		border-color: var(--_primary-dark);
		background-color: var(--_primary-dark);
		color: var(--_primary-dark-invert);
	}

	/* a text link, so the way into the settings doesn't compete with the two choices */
	.ghost,
	.ghost:hover {
		border-color: transparent;
		background-color: transparent;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.ghost:hover {
		text-decoration-thickness: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
