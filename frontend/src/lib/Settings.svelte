<script lang="ts">
	import { getOptionalConsent, getPendingPolicies, goBack, saveConsent } from "../store/consent.svelte";
	import { config } from "../store/config.svelte";
	import { t } from "../store/translations.svelte";
	import type { Policy } from "../types";
	import Button from "./Button.svelte";
	import Links from "./Links.svelte";

	let selection = $state(getOptionalConsent() ?? []);
	const { added, changed } = getPendingPolicies();

	const hasDetails = (policy: Policy) =>
		Boolean(policy.provider || policy.location || policy.privacy || policy.cookies.length);
</script>

<h2 id="cc-title" tabindex="-1">{t("settings.headline")}</h2>
<p id="cc-text">{t("settings.text")}</p>
<Links />

<div class="categories">
	{#each config.categories as category (category.id)}
		<div class="category" role="group" aria-labelledby="cc-category-{category.id}">
			<h3 id="cc-category-{category.id}">{category.label}</h3>
			{#if category.description}
				<p>{category.description}</p>
			{/if}
			{#if category.required}
				<p class="always-active">{t("settings.required")}</p>
			{/if}

			{#each config.policies.filter((policy) => policy.category === category.id) as policy (policy.id)}
				<div class="policy" class:required={category.required}>
					{#if !category.required}
						<span class="switch">
							<input
								id="cc-policy-{policy.id}"
								type="checkbox"
								role="switch"
								value={policy.id}
								bind:group={selection}
								aria-describedby={policy.description ? `cc-policy-${policy.id}-description` : undefined}
							/>
							<!-- ::part() can't see the hidden checkbox's state, so the visible track carries it as a part name -->
							<span
								class="track"
								aria-hidden="true"
								part={selection.includes(policy.id) ? "switch switch-checked" : "switch"}
							></span>
						</span>
					{/if}
					<div class="content">
						{#if category.required}
							<p class="label">{policy.label}</p>
						{:else}
							<label for="cc-policy-{policy.id}">
								{policy.label}
								{#if added.includes(policy.id)}
									<span class="badge">{t("settings.new")}</span>
								{:else if changed.includes(policy.id)}
									<span class="badge">{t("settings.changed")}</span>
								{/if}
							</label>
						{/if}
						{#if policy.description}
							<p id="cc-policy-{policy.id}-description">{policy.description}</p>
						{/if}
						{#if hasDetails(policy)}
							<details part="details">
								<!-- every policy has a "Details" toggle, so the hidden label tells them apart -->
								<summary>
									{t("settings.details")}<span class="visually-hidden">: {policy.label}</span>
								</summary>
								<div class="panel">
									<dl>
										{#if policy.provider}
											<dt>{t("details.provider")}</dt>
											<dd>{policy.provider}</dd>
										{/if}
										{#if policy.location}
											<dt>{t("details.location")}</dt>
											<dd>{policy.location}</dd>
										{/if}
										{#if policy.cookies.length > 0}
											<dt>{t("details.cookies")}</dt>
											<dd>
												<ul>
													{#each policy.cookies as cookie, index (index)}
														<li>
															<code>{cookie.name}</code>{#if cookie.duration}: {cookie.duration}{/if}
														</li>
													{/each}
												</ul>
											</dd>
										{/if}
									</dl>
									{#if policy.privacy}
										<p><a href={policy.privacy}>{t("details.privacy")}</a></p>
									{/if}
								</div>
							</details>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>

<div class="actions">
	<Button onclick={goBack}>{t("buttons.cancel")}</Button>
	<Button variant="primary" onclick={() => saveConsent(selection)}>{t("buttons.save")}</Button>
</div>

<style>
	.categories {
		margin-top: 1.5em;
	}

	.category + .category {
		margin-top: 1em;
		padding-top: 1em;
		border-top: 1px solid var(--_secondary);
	}

	h3 {
		margin: 0 0 0.25em;
		font-size: 1em;
	}

	.always-active {
		margin-top: 0.5em;
		font-weight: bold;
	}

	.policy {
		display: flex;
		gap: 1em;
		align-items: flex-start;
		margin-top: 0.8em;
		font-size: 0.9em;
	}

	.content {
		flex: 1 1 auto;
		min-width: 0;
	}

	label,
	.label {
		font-weight: bold;
	}

	label {
		cursor: pointer;
	}

	details {
		margin-top: 0.4em;
	}

	summary {
		display: flex;
		gap: 0.5em;
		align-items: center;
		width: fit-content;
		list-style: none;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 0.2em;
		transition: text-decoration-color 0.2s;
	}

	summary:hover {
		text-decoration-color: currentColor;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::before {
		content: "";
		width: 0.4em;
		height: 0.4em;
		margin-inline: 0.1em;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		rotate: -45deg;
		transition: rotate 0.2s;
	}

	details[open] > summary::before {
		rotate: 45deg;
	}

	summary:focus-visible,
	details a:focus-visible {
		outline: 2px solid var(--_focus);
		outline-offset: 2px;
	}

	.panel {
		margin-top: 0.5em;
		padding: 0.75em 1em;
		border-radius: 0.5em;
		background: color-mix(in srgb, var(--_text) 5%, var(--_background));
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.4em 1.25em;
		margin: 0;
	}

	dt {
		font-weight: bold;
	}

	dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	ul {
		display: grid;
		gap: 0.3em;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	code {
		padding: 0.1em 0.35em;
		border-radius: 0.25em;
		background: var(--_background);
		font-size: 0.9em;
	}

	dl:not(:empty) + p {
		margin-top: 0.75em;
		padding-top: 0.75em;
		border-top: 1px solid var(--_secondary);
	}

	details a {
		color: inherit;
		text-underline-offset: 0.2em;
	}

	.badge {
		display: inline-block;
		margin-inline-start: 0.4em;
		padding: 0 0.5em;
		border-radius: 100px;
		background: var(--_primary);
		color: var(--_primary-invert);
		font-size: 0.85em;
		font-weight: normal;
		vertical-align: 0.1em;
	}

	.switch {
		position: relative;
		flex: 0 0 auto;
		width: 3em;
		height: 1.5em;
		margin-top: 0.1em;
	}

	/* the real checkbox sits invisibly on top of the track, so it keeps keyboard focus, clicks and screen reader support */
	input {
		position: absolute;
		z-index: 1;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	/* a filled track instead of an outline still gives the off state 3:1 contrast, for the track and the knob on it */
	.track {
		position: absolute;
		inset: 0;
		border-radius: 100px;
		background: var(--_border);
		transition: background-color 0.2s;
	}

	.track::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 0.15em;
		width: 1.1em;
		height: 1.1em;
		border-radius: 50%;
		background: var(--_background);
		translate: 0 -50%;
		transition: left 0.2s;
	}

	input:checked + .track {
		background: var(--_primary);
	}

	input:checked + .track::after {
		left: calc(100% - 1.25em);
	}

	input:focus-visible + .track {
		outline: 2px solid var(--_focus);
		outline-offset: 2px;
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 0.5em;
		margin-top: 1.5em;
	}

	@media (max-width: 400px) {
		.actions {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track,
		.track::after,
		summary,
		summary::before {
			transition: none;
		}
	}
</style>
