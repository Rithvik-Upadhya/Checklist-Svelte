<script>
	import { user } from '$lib/stores/authStore';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	import ToastContainer from './ToastContainer.svelte';
	import Auth from './Auth.svelte';
	import Lists from './Lists.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>{'Checklist' + ($page.data.title ? ' - ' + $page.data.title : '')}</title>
	<!-- Open Graph Meta Tags -->
	<meta
		property="og:title"
		content={'Checklist' + ($page.data.title ? ' - ' + $page.data.title : '')}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:image" content={$page.data.ogImage || '/favicon.png'} />
	<meta
		property="og:description"
		content={$page.data.description || "What's on your to-do list?"}
	/>
</svelte:head>

<ToastContainer />
<header>
	<div class="wrapper">
		<Icon icon="iconoir:menu" class="h-d" />
		<nav>
			<div class="branding">
				<h1 id="title">
					{#if user?.name}
						{user?.name}
						<br />
					{/if}
					<span>
						<img height="25" src="/favicon-green-2.png" alt="Green Checklist Logo" />
						Checklist
					</span>
				</h1>
				<p>No frills, just checklists.</p>
			</div>
			<Lists />
			<Auth />
		</nav>
	</div>
</header>
<main id="content">
	<section>
		<slot />
	</section>
</main>

<style lang="less">
	@import '../variables.less';

	header {
		padding: 20px 0;
		width: 350px;

		@media @s-d {
			height: 100%;
		}

		> .wrapper {
			border-right: 1px solid var(--bdC);
			height: 100%;
			padding: 30px 25px;

			nav {
				height: 100%;
				display: flex;
				flex-direction: column;
				.branding {
					h1 {
						font-size: 2.2em;
						margin-top: 0;
						margin-bottom: 15px;

						span {
							color: var(--accentC);
						}
					}
					p {
						font-size: 1.1em;
						margin-bottom: 0;
					}
					border-bottom: 1px solid var(--bdC);
					padding-bottom: 20px;
					margin-bottom: 20px;
				}
			}
		}
	}

	main {
		padding: 50px 25px;
	}
</style>
