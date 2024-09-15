<script>
	import { tick } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toastStore } from '$lib/stores/toast';
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let creatingNewList = false;
	let newListName = '';
	let newListBtn;
	let newListInput;
	let lists = [];
	let selectedList;

	// Load lists on component mount
	onMount(async () => {
		await loadLists();
	});

	async function loadLists() {
		if ($user) {
			const { data, error } = await supabase
				.from('checklists')
				.select('name')
				.eq('user_id', $user.id);
			if (error) console.error('Error loading lists:', error);
			else lists = data.map((item) => item.name);
		} else {
			lists = JSON.parse(localStorage.getItem('lists') || '[]');
		}
	}

	async function saveList(name) {
		// Check if the list name already exists
		if (lists.includes(name)) {
			toastStore.error('A list with this name already exists.');
			return;
		}
		if ($user) {
			const { error } = await supabase.from('lists').insert({ name, user_id: $user.id });
			if (error) console.error('Error saving list:', error);
		} else {
			lists = [...lists, name];
			localStorage.setItem('lists', JSON.stringify(lists));
		}
		await loadLists();
	}

	async function handleListCreation(event) {
		if (creatingNewList) return;

		creatingNewList = true;
		await tick();
		newListInput.focus();

		event.stopPropagation();

		const handleOutsideClick = (e) => {
			console.log('clicked');
			if (!newListBtn.contains(e.target)) {
				creatingNewList = false;
				removeEventListeners();
			}
		};

		const handlePlusClick = async () => {
			if (newListName.trim()) {
				await saveList(newListName.trim());
				newListName = '';
				creatingNewList = false;
				removeEventListeners();
			}
		};

		const handleEnterKey = async (e) => {
			if (e.key === 'Enter' && newListName.trim()) {
				await saveList(newListName.trim());
				newListName = '';
				creatingNewList = false;
				removeEventListeners();
			}
		};

		const removeEventListeners = () => {
			window.removeEventListener('click', handleOutsideClick);
			plusBtn.removeEventListener('click', handlePlusClick);
			newListInput.removeEventListener('keydown', handleEnterKey);
		};

		window.addEventListener('click', handleOutsideClick);

		const plusBtn = newListBtn.querySelector('.create-list');
		plusBtn.addEventListener('click', handlePlusClick);

		newListInput.addEventListener('keydown', handleEnterKey);

		// Return a cleanup function
		return removeEventListeners;
	}
</script>

<div class="lists">
	{#each lists as list, index (list)}
		<button
			type="button"
			class="list-item"
			class:selected={selectedList === list}
			on:click={() => (selectedList = list)}
		>
			{list}
		</button>
	{/each}
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

<style lang="less">
	.lists {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;

		button {
			background-color: transparent;
			display: inline-flex;
			align-items: center;
			gap: 10px;
			width: 100%;
			color: var(--textC3);
			border: 0;
			padding: 10px 15px;
			border-radius: 5px;
			cursor: pointer;
			font-weight: 600;

			&.selected,
			&:hover,
			&:focus-within {
				background-color: var(--bgC2);
			}

			&.new-list {
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
	}
</style>
