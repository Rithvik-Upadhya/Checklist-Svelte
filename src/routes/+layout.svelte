<script>
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		checkIfLoggedIn();

		supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				user.set(session.user);
			} else if (event === 'SIGNED_OUT') {
				user.set(null);
			}
		});
	});

	async function checkIfLoggedIn() {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session) {
			user.set(session.user);
		}
	}

	let creatingNewList = false;
	let newListName = '';
	let newListBtn;
	let newListInput;
	let email = '';
	let captchaToken = '';

	async function handleListCreation(event) {
		if (creatingNewList) return;

		creatingNewList = true;
		console.log(creatingNewList);
		await tick();
		newListInput.focus();

		event.stopPropagation();

		let plusBtn = newListBtn.querySelector('.create-list');

		plusBtn.addEventListener('click', () => {
			console.log('clicked');
		});

		newListInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				console.log('enter');
			}
		});

		window.addEventListener('click', (e) => {
			if (!newListBtn.contains(e.target)) {
				creatingNewList = false;
			}
		});
	}

	const signupCaptcha = document.getElementById('signupCaptcha');

	signupCaptcha.addEventListener('verified', (e) => {
		captchaToken = e.token;
		console.log('verified');
	});
	signupCaptcha.addEventListener('error', (e) => {
		captchaToken = '';
		console.log('error event', { error: e.error });
	});

	async function handleEmailSignIn() {
		if (!captchaToken) {
			alert('Please complete the captcha first');
			return;
		}
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { captchaToken }
		});
		if (error) {
			console.error('Error sending magic link:', error);
		} else {
			alert('Check your email for the login link!');
		}
	}

	async function handleGoogleSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { captchaToken }
		});
		if (error) console.error('Error signing in with Google:', error);
	}

	async function handleGitHubSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: { captchaToken }
		});
		if (error) console.error('Error signing in with GitHub:', error);
	}
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
	{#if !$user}
		<script src="https://cdn.jsdelivr.net/npm/@hcaptcha/vanilla-hcaptcha" async defer></script>
	{/if}
</svelte:head>

<header>
	<div class="wrapper">
		<Icon icon="iconoir:menu" class="h-d" />
		<nav>
			<div class="branding">
				<h1 id="title">
					{#if $page.data.user}
						{$page.data.user.name}
						<br />
					{/if}
					<span>
						<img height="25" src="/favicon-green-2.png" alt="Green Checklist Logo" />
						Checklist
					</span>
				</h1>
				<p>No frills, just checklists.</p>
			</div>
			<div class="lists">
				<button type="button" class="new-list" on:click={handleListCreation} bind:this={newListBtn}>
					<Icon icon="ph:plus-fill" height="25" width="25" class="create-list" />
					{#if creatingNewList}
						<input
							type="text"
							bind:value={newListName}
							name="new-list-name"
							id="new-list-name"
							placeholder="List Name"
							bind:this={newListInput}
						/>
					{:else}
						<span>New List</span>
					{/if}
				</button>
			</div>
			<div class="account">
				{#if $user}
					<p>Welcome, {$user.email}</p>
				{:else}
					<form class="email-signin" on:submit|preventDefault={handleEmailSignIn}>
						<input type="email" name="email" id="email" placeholder="Email" bind:value={email} />
						<button
							type="submit"
							title="Sign in or register with email"
							aria-label="Sign in or register with email"
						>
							<Icon icon="solar:square-arrow-right-bold" height="30" width="30" />
						</button>
					</form>
					<div class="social-signins">
						<button
							type="button"
							class="google-signin"
							on:click={handleGoogleSignIn}
							aria-label="Sign in with Google"
						>
							<Icon icon="bi:google" height="24" width="24" style="color: var(--textC3)" />
						</button>
						<button
							type="button"
							class="github-signin"
							on:click={handleGitHubSignIn}
							aria-label="Sign in with GitHub"
						>
							<Icon icon="bi:github" height="24" width="24" style="color: var(--textC3)" />
						</button>
					</div>
					<h-captcha
						id="signupCaptcha"
						site-key="1d1ea68e-3a62-4812-a504-cc8edec2ca00"
						size="invisible"
					></h-captcha>
				{/if}
			</div>
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

				.lists {
					flex-grow: 1;
					button.new-list {
						display: inline-flex;
						align-items: center;
						gap: 10px;
						width: 100%;
						background-color: var(--bgC2);
						color: var(--textC3);
						border: 0;
						padding: 10px 15px;
						border-radius: 5px;
						cursor: pointer;

						span {
							font-weight: 600;
						}

						input {
							font-family: var(--fontFamily1);
							background-color: transparent;
							color: var(--textC3);
							outline: 0;
							border: 0;
							font-weight: 600;
							width: 200px;
						}
					}
				}

				.account {
					border-top: 1px solid var(--bdC);
					padding-top: 20px;
					margin-top: 20px;

					form.email-signin {
						display: flex;
						gap: 10px;
						align-items: center;
						background-color: var(--bgC2);
						border-radius: var(--bdRadius);
						outline: 0;
						border: 0;
						padding: 10px 15px 10px 15px;
						input {
							color: var(--textC3);
							background-color: transparent;
							flex-grow: 1;
							font-size: 0.9em;
						}
						button[type='submit'] {
							display: flex;
							background-color: transparent;
							color: var(--textC3);
							width: 30px;
							padding: 0;
							cursor: pointer;
						}
					}

					.social-signins {
						margin-top: 20px;
						display: flex;
						gap: 10px;
						align-items: center;
						justify-content: center;

						button {
							flex-grow: 1;
							background-color: var(--bgC2);
							border: 1px solid var(--bdC);
							border-radius: var(--bdRadius);
							padding: 10px 15px;
							cursor: pointer;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}

	main {
		padding: 50px 25px;
	}
</style>
