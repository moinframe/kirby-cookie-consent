<svelte:options customElement={{ tag: "cookie-consent", shadow: "open" }} />

<script lang="ts">
	import Settings from "./lib/Settings.svelte";
	import Start from "./lib/Start.svelte";
	import { goBack, ui } from "./store/consent.svelte";
	import { config } from "./store/config.svelte";

	let dialog: HTMLDialogElement;
	const modal = $derived(config.options.blockPage);

	$effect(() => {
		// re-run on view changes, so focus follows the swapped content instead of falling back to <body>
		ui.view;

		if (!ui.open) {
			if (dialog.open) dialog.close();
			return;
		}

		if (!dialog.open) {
			if (modal) dialog.showModal();
			else dialog.show();
		}
		dialog.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
	});

	$effect(() => {
		if (!ui.open || !modal) return;
		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = "hidden";
		return () => {
			root.style.overflow = overflow;
		};
	});

	// modal dialogs get Escape as a `cancel` event, non-modal ones only as a keydown
	const onkeydown = (event: KeyboardEvent) => {
		if (event.key === "Escape" && !modal) {
			event.preventDefault();
			goBack();
		}
	};

	const oncancel = (event: Event) => {
		event.preventDefault();
		goBack();
	};

	// browsers may still force-close a modal on repeated Escape
	const onclose = () => {
		ui.open = false;
	};
</script>

<dialog
	bind:this={dialog}
	class:center={config.options.position === "center"}
	class:bar={config.options.layout === "bar" && ui.view === "start"}
	aria-labelledby="cc-title"
	aria-describedby="cc-text"
	part="dialog"
	{onkeydown}
	{oncancel}
	{onclose}
>
	{#if ui.view === "settings"}
		<Settings />
	{:else}
		<Start />
	{/if}
</dialog>

<style>
	dialog {
		--_primary: var(--cc-primary-color, hsl(103 88% 28%));
		--_primary-invert: var(--cc-primary-color-invert, white);
		--_primary-dark: var(--cc-primary-color-dark, hsl(103 88% 22%));
		--_primary-dark-invert: var(--cc-primary-color-dark-invert, white);
		--_secondary: var(--cc-secondary-color, lightgray);
		--_secondary-invert: var(--cc-secondary-color-invert, black);
		--_secondary-dark: var(--cc-secondary-color-dark, rgb(161 160 160));
		--_secondary-dark-invert: var(--cc-secondary-color-dark-invert, black);
		--_border: var(--cc-border-color, #8c8c8c);
		--_background: var(--cc-background, white);
		--_text: var(--cc-text, black);
		--_focus: var(--cc-focus-color, var(--_text));
		--_radius: 0.4em;
		--_shadow: 0 0 0 1px rgb(0 0 0 / 0.06), 0 0.25em 1em rgb(0 0 0 / 0.1);

		position: fixed;
		z-index: 999;
		inset: auto 2em 2em auto;
		box-sizing: border-box;
		width: calc(100% - 4em);
		max-width: 560px;
		max-height: calc(100dvh - 4em);
		margin: 0;
		padding: 2em;
		overflow-y: auto;
		border: 0;
		border-radius: var(--_radius);
		box-shadow: var(--_shadow);
		background: var(--_background);
		color: var(--_text);
		font-family: var(
			--cc-font-family,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			Roboto,
			Helvetica,
			Arial,
			sans-serif
		);
		font-size: var(--cc-font-size, 14px);
		line-height: 1.5;
		text-align: start;
	}

	dialog[open] {
		animation: cc-in 0.2s ease-out;
	}

	dialog.center {
		inset: 0;
		margin: auto;
	}

	/* both side insets plus auto margins center it, and the max-width keeps it from stretching on wide screens */
	dialog.bar {
		inset: auto 1.5em 1.5em;
		width: auto;
		max-width: 1100px;
		margin-inline: auto;
		padding: 1em 1em 1em 1.5em;
	}

	dialog::backdrop {
		background-color: var(--cc-overlay-background, rgb(255 255 255 / 0.5));
	}

	dialog :global(h2) {
		margin: 0 0 0.5em;
		font-size: 1.25em;
		line-height: 1.3;
	}

	dialog :global(h2:focus) {
		outline: none;
	}

	dialog :global(p) {
		margin: 0;
	}

	dialog :global(.visually-hidden) {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (max-width: 600px) {
		dialog,
		dialog.center {
			inset: auto 0 0 0;
			width: 100%;
			max-width: none;
			max-height: 100dvh;
			border-radius: 0;
		}

		dialog.bar {
			inset: auto 0.75em 0.75em;
			max-height: calc(100dvh - 1.5em);
			padding: 1em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog[open] {
			animation: none;
		}
	}

	@keyframes cc-in {
		from {
			opacity: 0;
			translate: 0 2em;
		}
	}
</style>
