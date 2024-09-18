<script>
	import { selectedList } from '$lib/stores/listStore';
</script>

{#if !$selectedList}
	<h1 id="title">What's on your <br /><span>to-do list?</span></h1>
	<p>Select a list to get started.</p>
{/if}

<style lang="less">
	h1 {
		font-size: 1.6em;
		margin-top: 0;
		margin-bottom: 15px;

		span {
			color: var(--accentC);
		}
	}
</style>
