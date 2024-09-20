<script>
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	let isAboutOpen = false;
</script>

<h1 id="title">What's on your <br /><span>to-do list?</span></h1>
<p>Select a list to get started.</p>

<div class="about-section">
	<button on:click={() => (isAboutOpen = !isAboutOpen)} class="accordion-button">
		<span>About This App</span>
		<Icon icon={isAboutOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
	</button>
	{#if isAboutOpen}
		<div transition:slide={{ duration: 300 }} class="accordion-content">
			<p>
				This app is designed to be a minimalist checklist, offering a streamlined alternative to the
				often overengineered options available in the market.
			</p>
			<p>
				When you're not logged in, the app stores your information locally. This approach enhances
				privacy, as your data remains on your device. However, please note that your lists will be
				deleted if you clear your browser's storage.
			</p>
			<p>
				For users who log in, we save your lists along with your account information. This feature
				allows you to access your checklists across all your devices, providing seamless
				synchronization and accessibility.
			</p>
			<p>
				Our goal is to provide a simple, efficient, and user-friendly checklist experience without
				unnecessary complications.
			</p>
		</div>
	{/if}
</div>

<style lang="less">
	h1 {
		font-size: 1.6em;
		margin-top: 0;
		margin-bottom: 15px;

		span {
			color: var(--accentC);
		}
	}
	.about-section {
		margin-top: 20px;
		width: 600px;
		max-width: 100%;
	}

	.accordion-button {
		padding: 10px 0;
		background: transparent;
		border-radius: var(--bdRadius);
		border: none;
		text-align: left;
		cursor: pointer;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
		color: var(--textC3);
	}

	.accordion-content {
		padding: 0;

		p {
			margin-bottom: 10px;
		}
	}
</style>
