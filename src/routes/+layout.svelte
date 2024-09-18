<script>
	import { page } from '$app/stores';

	import ToastContainer from './ToastContainer.svelte';
	import Auth from './Auth.svelte';
	import Lists from './Lists.svelte';
	import { onMount } from 'svelte';

	import '../app.css';

	let isReady = false;

	onMount(() => {
		isReady = true;
	});
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
		<nav>
			<div class="branding">
				<a href="/" alt="Home">
					<h1 id="title">
						<span>
							<img height="25" src="/favicon-green-2.png" alt="Green Checklist Logo" />
							Checklist
						</span>
					</h1>
				</a>
				<p>No frills, just checklists.</p>
			</div>
			{#if isReady}
				<Lists />
				<Auth />
			{/if}
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

		@media @s-nm {
			width: 350px;
			height: 100%;
		}

		> .wrapper {
			@media @s-nm {
				border-right: 1px solid var(--bdC);
				padding: 30px 25px 20px 25px;
			}

			@media @s-m {
				padding: 10px 25px;
			}
			height: 100%;

			nav {
				display: grid;
				grid-template-rows: auto 1fr auto;
				height: 100%;
				position: relative;

				@media @s-nm {
					overflow-y: auto;
				}

				.branding {
					@media @s-m {
						order: 2;
						grid-row: 1;
						grid-column: 2/3;

						> p {
							display: none;
						}
						a {
							h1 {
								font-size: 1.2em;
								margin-top: 0;
								margin-bottom: 0;

								span {
									display: flex;
									align-items: center;
									justify-content: center;
									gap: 10px;
								}

								img {
									height: 25px;
								}
							}
						}
					}
					@media @s-nm {
						border-bottom: 1px solid var(--bdC);
						padding-bottom: 20px;
						margin-bottom: 20px;
					}
					a {
						text-decoration: none;
						h1 {
							@media @s-nm {
								font-size: 2.2em;
								margin-top: 3px;
								margin-bottom: 15px;
							}

							span {
								color: var(--accentC);
							}
						}
					}
					p {
						font-size: 1.1em;
						margin-bottom: 0;
					}
				}
			}
		}
	}

	main {
		@media @s-nm {
			padding: 50px 25px;
		}

		@media @s-m {
			padding: 0 25px 50px 25px;
		}
		section {
			height: 100%;
			overflow: auto;
		}
	}
</style>
