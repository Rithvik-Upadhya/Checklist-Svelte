<script>
	import { selectedList } from '$lib/stores/listStore';
	import Checklist from './Checklist.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let showNotFound = false;

	onMount(() => {
		// Add a delay before showing the "List not found" message
		setTimeout(() => {
			showNotFound = true;
		}, 1000); // 2 seconds delay
	});
</script>

{#if $selectedList}
	<Checklist />
{:else if showNotFound}
	<p>List not found.</p>
{:else}
	<p class="loading">
		<Icon icon="eos-icons:loading" height="30" width="30" />
		Loading...
	</p>
{/if}

<style lang="less">
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
