<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

<h1>{$page.status}: {$page.error?.message}</h1>
<p>Sorry, an error occurred. Please try again later.</p>
<a href="/">Go back to homepage</a>

<style>
	h1 {
		font-size: 1.8em;
		margin-bottom: 20px;
	}
</style>
