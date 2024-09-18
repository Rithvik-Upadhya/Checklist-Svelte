<script>
	import { selectedList } from '$lib/stores/listStore';
	import Checklist from './Checklist.svelte';
</script>

{#if $selectedList}
	<Checklist />
{:else}
	<p>List not found.</p>
{/if}
