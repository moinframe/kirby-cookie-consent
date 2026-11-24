<script lang="ts">
	import { acceptAll, declineAll, openSettings } from "../store/consent.svelte";
	import { config } from "../store/config.svelte";
	import { t } from "../store/translations.svelte";
	import Button from "./Button.svelte";
	import Links from "./Links.svelte";

	const bar = $derived(config.options.layout === "bar");
</script>

<!-- the bar hides the heading visually only: it still names the dialog and receives focus -->
<h2 id="cc-title" tabindex="-1" class:visually-hidden={bar}>{t("start.headline")}</h2>

<div class:bar>
	<div class="text">
		<p id="cc-text">{t("start.text")}</p>
		<Links />
	</div>

	<div class="actions">
		<!-- DOM order follows the visual order of each layout, so tabbing doesn't jump around -->
		{#if bar}
			<div class="settings">
				<Button variant="ghost" onclick={() => openSettings(false)}>{t("buttons.settings")}</Button>
			</div>
		{/if}
		<div class="choices">
			<Button onclick={declineAll}>{t("buttons.decline")}</Button>
			<Button onclick={acceptAll}>{t("buttons.acceptall")}</Button>
		</div>
		{#if !bar}
			<Button variant="ghost" onclick={() => openSettings(false)}>{t("buttons.settings")}</Button>
		{/if}
	</div>
</div>

<style>
	.actions {
		display: grid;
		gap: 0.5em;
		margin-top: 1.5em;
	}

	/* declining has to be as easy as accepting, so both share a style and a width */
	.choices {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5em;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75em 1.5em;
		align-items: center;
	}

	.bar .text {
		flex: 1 1 20em;
	}

	.bar .actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 0;
	}

	.bar .choices {
		flex: 1 0 auto;
	}

	.bar .actions :global(button) {
		white-space: nowrap;
	}

	@media (max-width: 400px) {
		.choices {
			grid-template-columns: 1fr;
		}

		.bar .actions,
		.bar .settings {
			width: 100%;
		}
	}
</style>
