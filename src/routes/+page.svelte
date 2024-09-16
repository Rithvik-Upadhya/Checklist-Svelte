<script>
	import Checklist from './Checklist.svelte';
	import { selectedList } from '$lib/stores/listStore';
</script>

<h1 id="title">What's on your <br /><span>to-do list? </span></h1>

{#if $selectedList}
	<Checklist />
{:else}
	<p>Select a list to get started.</p>
{/if}

<style lang="less">
	h1 {
		font-size: 2.2em;
		margin-top: 0;
		margin-bottom: 15px;

		span {
			color: var(--accentC);
		}
	}
</style>
