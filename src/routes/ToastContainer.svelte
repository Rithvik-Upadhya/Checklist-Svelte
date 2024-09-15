<script>
	import { toastStore } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { flip } from 'svelte/animate';

	function removeToast(id) {
		toastStore.remove(id);
	}
</script>

<div class="toast-container">
	{#each $toastStore as toast (toast.id)}
		<div
			class="toast"
			animate:flip
			transition:fly={{ y: -50, duration: 300 }}
			role="alert"
			aria-live="polite"
		>
			<div class="toast-header">
				<div class="toast-type {toast.type}">
					{#if toast.type === 'success'}
						<Icon icon="ph:check-circle-fill" height="20" width="20" />
						<span>Success</span>
					{:else if toast.type === 'error'}
						<Icon icon="ph:x-circle-fill" height="20" width="20" />
						<span>Error</span>
					{:else if toast.type === 'warning'}
						<Icon icon="ph:warning-circle-fill" height="20" width="20" />
						<span>Warning</span>
					{:else if toast.type === 'info'}
						<Icon icon="f7:info-circle-fill" height="20" width="20" />
						<span>Info</span>
					{/if}
				</div>
				<button on:click={() => removeToast(toast.id)}>
					<Icon icon="ic:round-close" height="20" width="20" />
				</button>
			</div>
			<div class="toast-message">
				<p>{toast.message}</p>
			</div>
		</div>
	{/each}
</div>

<style lang="less">
	.toast-container {
		position: fixed;
		right: 0;
		height: 100%;
		max-height: 100%;
		overflow-y: auto;
		z-index: 20;
		top: 0;
	}

	.toast {
		padding: 15px;
		border-radius: var(--bdRadius);
		background-color: var(--bgC2);
		color: var(--textC3);
		border: 1px solid var(--bdC);
		font-size: 0.95em;
		min-width: 300px;
		max-width: 400px;
		margin: 20px;
	}

	.toast-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;

		.toast-type {
			display: flex;
			align-items: center;
			gap: 0 8px;
			margin-bottom: 10px;
			&.success {
				color: #4caf50;
			}
			&.error {
				color: #f44336;
			}
			&.warning {
				color: #ff9800;
			}
			&.info {
				color: #2196f3;
			}
		}

		button {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			cursor: pointer;
			outline: inherit;
			appearance: none;
		}
	}

	.toast-message {
		margin: 0 20px 0 30px;

		p {
			margin: 0;
		}
	}
</style>
