<script>
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/authStore';
	import Icon from '@iconify/svelte';
	import { toastStore } from '$lib/stores/toast';

	let email = '';
	let signingIn = false;

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
</div>

<style lang="less">
	.account {
		border-top: 1px solid var(--bdC);
		padding-top: 20px;
		margin-top: 20px;

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
	}
</style>
