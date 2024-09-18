<script>
	import { tick } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toastStore } from '$lib/stores/toast';
	import { user } from '$lib/stores/authStore';
	import { lists, selectedList } from '$lib/stores/listStore';

	let creatingNewList = false;
	let newListName = '';
	let newListBtn;
	let newListInput;
	let listsEl;
	let isExpanded = false;

	$: if ($user) {
		lists.load($user.id);
	} else {
		lists.load();
	}

	function expandMenu() {
		isExpanded = !isExpanded;

		if (isExpanded) {
			// Use setTimeout to add the event listener after the current event loop
			setTimeout(() => {
				function onClick(event) {
					if (listsEl && !listsEl.contains(event.target)) {
						isExpanded = false;
						document.removeEventListener('click', onClick);
					}
					if (event.target.classList.contains('list-item')) {
						isExpanded = false;
						document.removeEventListener('click', onClick);
					}
				}
				document.addEventListener('click', onClick);
			}, 0);
		}
	}

	async function saveList(name) {
		// Check if the list name already exists
		if ($lists.some((list) => list.name === name)) {
			toastStore.error('A list with this name already exists.');
			return;
		}
		lists.add(name, $user?.id);
	}

	async function handleListCreation(event) {
		if (creatingNewList) return;

		creatingNewList = true;
		await tick();
		newListInput.focus();

		event.stopPropagation();

		const handleOutsideClick = (e) => {
			if (!newListBtn.contains(e.target)) {
				creatingNewList = false;
				removeEventListeners();
			}
		};

		const handlePlusClick = async () => {
			if (newListName.trim()) {
				await saveList(newListName.trim());
				creatingNewList = false;
				newListName = '';
				removeEventListeners();
			}
		};

		const handleEnterKey = async (e) => {
			if (e.key === 'Enter' && newListName.trim()) {
				await saveList(newListName.trim());
				creatingNewList = false;
				newListName = '';
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
	<button
		type="button"
		class="lists-btn h-nm"
		aria-haspopup="listbox"
		aria-expanded={isExpanded}
		aria-label="Lists"
		aria-controls="lists"
		on:click|stopPropagation={expandMenu}
	>
		<Icon icon="fa-solid:list" height="20" width="20" />
	</button>
	<div class="wrapper" id="lists" bind:this={listsEl} role="listbox" aria-label="Lists">
		{#each $lists as list (list.id)}
			<button
				type="button"
				class="list-item"
				class:selected={list?.id === $selectedList?.id}
				on:click={() => ($selectedList = list)}
			>
				{list.name}
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
</div>

<style lang="less">
	@import '../variables.less';

	.lists {
		@media @s-nm {
			flex-grow: 1;
		}
		@media @s-m {
			order: 1;
			grid-row: 1;
			grid-column: 1/2;
			display: flex;
			align-items: center;
		}

		.lists-btn {
			background-color: transparent;
			color: var(--textC);
			cursor: pointer;
			@media @s-m {
				display: inherit;
			}
		}

		.lists-btn[aria-expanded='true'] + .wrapper {
			@media @s-m {
				max-height: 300px;
				padding: 10px 10px;
				border-width: 1px;
			}
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			gap: 10px;
			overflow-y: auto;

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
	}
</style>
