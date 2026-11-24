<script lang="ts">
	import { config } from "../store/config.svelte";
</script>

{#if config.links.length > 0}
	<p class="links">
		{#each config.links as link (link.url)}
			<a href={link.url} part="link">{link.label}</a>
		{/each}
	</p>
{/if}

<style>
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em 1em;
		margin-top: 0.75em;
		font-size: 0.9em;
	}

	a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	a:hover {
		text-decoration-thickness: 2px;
	}

	a:focus-visible {
		outline: 2px solid var(--_focus);
		outline-offset: 2px;
	}
</style>
