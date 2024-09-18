<script>
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/authStore';
	import Icon from '@iconify/svelte';
	import { toastStore } from '$lib/stores/toast';

	let email = '';
	let signingIn = false;
	let authEl;
	let isExpanded = false;

	function expandMenu() {
		isExpanded = !isExpanded;

		if (isExpanded) {
			// Use setTimeout to add the event listener after the current event loop
			setTimeout(() => {
				function onClick(event) {
					if (authEl && !authEl.contains(event.target)) {
						isExpanded = false;
						document.removeEventListener('click', onClick);
					}
				}
				document.addEventListener('click', onClick);
			}, 0);
		}
	}

	supabase.auth.onAuthStateChange((event, session) => {
		if (event === 'SIGNED_IN') {
			user.set(session.user);
		} else if (event === 'SIGNED_OUT') {
			user.set(null);
		}
	});

	async function handleSignOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toastStore.error('Error signing out.');
			console.error('Error signing out:', error);
		} else {
			toastStore.success('Signed out.');
		}
	}

	async function handleEmailSignIn() {
		signingIn = true;
		const { error } = await supabase.auth.signInWithOtp({
			email
		});
		if (error) {
			toastStore.error('Error sending login link.');
			console.error('Error sending magic link:', error);
		} else {
			toastStore.success('Check your email for the login link!');
		}
		signingIn = false;
	}

	async function handleGoogleSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google'
		});
		if (error) {
			toastStore.error('Error signing in with Google.');
			console.error('Error signing in with Google:', error);
		} else {
			toastStore.success('Signed in with Google.');
		}
	}

	async function handleGitHubSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
		if (error) {
			toastStore.error('Error signing in with GitHub.');
			console.error('Error signing in with GitHub:', error);
		} else {
			toastStore.success('Signed in with GitHub.');
		}
	}
</script>

<div class="account">
	<button
		type="button"
		class="auth-btn h-nm"
		aria-haspopup="listbox"
		aria-expanded={isExpanded}
		aria-label="Account"
		aria-controls="auth"
		on:click|stopPropagation={expandMenu}
	>
		<Icon icon="fa6-solid:user" height="20" width="20" />
	</button>
	<div class="wrapper" id="auth" bind:this={authEl} role="listbox" aria-label="Account">
		{#if $user}
			<div class="user-email">
				<span title={$user?.email}>
					{$user?.email}
				</span>
				<button class="sign-out" on:click={handleSignOut} title="Sign out" aria-label="Sign out">
					<Icon icon="ic:round-logout" height="24" width="24" />
				</button>
			</div>
		{:else}
			<form class="email-signin" on:submit|preventDefault={handleEmailSignIn}>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					bind:value={email}
					disabled={signingIn}
					required
				/>
				<button
					type="submit"
					title="Sign in or register with email"
					aria-label="Sign in or register with email"
					disabled={signingIn}
				>
					{#if signingIn}
						<Icon icon="eos-icons:loading" height="30" width="30" />
					{:else}
						<Icon icon="solar:square-arrow-right-bold" height="30" width="30" />
					{/if}
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
		{/if}
		<p class="legal">
			<a href="/privacy">Privacy Policy</a>
			<span>•</span>
			<a href="/terms">Terms of Service</a>
		</p>
	</div>
</div>

<style lang="less">
	@import '../variables.less';

	.account {
		@media @s-nm {
			border-top: 1px solid var(--bdC);
			padding-top: 20px;
			margin-top: 20px;
		}

		@media @s-m {
			order: 3;
			grid-row: 1;
			grid-column: 3/4;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}

		.auth-btn {
			background-color: transparent;
			color: var(--textC);
			cursor: pointer;
			padding: 0;

			@media @s-m {
				display: inherit;
			}
		}

		.auth-btn[aria-expanded='true'] + .wrapper {
			@media @s-m {
				max-height: 300px;
				padding: 10px;
				border-width: 1px;
			}
		}

		.wrapper {
			@media @s-m {
				position: absolute;
				top: 35px;
				left: -10px;
				right: -10px;
				background-color: var(--bgC);
				border: 0px solid var(--bdC);
				border-radius: var(--bdRadius);
				box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
				max-height: 0;
				overflow: hidden;
				transition:
					max-height 0.3s ease-out,
					padding 0.3s ease-out,
					border-width 0.3s ease-out;
				padding: 0 10px;
				z-index: 10;
			}

			.user-email {
				width: 100%;
				background-color: var(--bgC2);
				border-radius: var(--bdRadius);
				border: 1px solid var(--bdC);
				font-size: 0.9em;
				color: var(--textC3);
				font-weight: 500;

				display: flex;
				align-items: center;

				span {
					border-right: 1px solid var(--bdC);
					padding: 10px 15px;
					text-overflow: ellipsis;
					overflow: hidden;
					flex-grow: 1;
				}

				.sign-out {
					padding: 10px 15px;
					display: flex;
					background-color: transparent;
					color: var(--textC3);
					cursor: pointer;
				}
			}

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

			.legal {
				margin: 15px 0 0 0;
				font-size: 0.7em;
				opacity: 0.7;
				color: var(--textC3);
				text-align: center;

				a {
					color: var(--textC3);
				}
			}
		}
	}
</style>
