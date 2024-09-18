<script>
	import { tasks } from '$lib/stores/taskStore';
	import { lists } from '$lib/stores/listStore';
	import { user } from '$lib/stores/authStore';
	import { selectedList } from '$lib/stores/listStore';
	import Icon from '@iconify/svelte';

	let newTask = '';

	$: if ($user) {
		tasks.load($selectedList, $user.id);
	} else {
		tasks.load($selectedList);
	}

	function addTask() {
		if (newTask.trim() === '') return;
		tasks.add(newTask, $selectedList, $user?.id);
		newTask = '';
	}

	function deleteList() {
		lists.delete($selectedList, $user?.id);
		$selectedList = null;
	}
</script>

<div class="checklist">
	<div class="title-row">
		<h1 title={$selectedList.name}>{$selectedList.name}</h1>
		<button class="delete" type="button" on:click={deleteList}>
			<Icon icon="mdi:trash" height="20" width="20" />
		</button>
	</div>
	<form on:submit|preventDefault={addTask}>
		<input id="new-task" type="text" bind:value={newTask} placeholder="Add a task" />
	</form>
	<hr />

	{#each $tasks.sort((a, b) => {
		if (a.done === b.done) {
			return new Date(b.created_at) - new Date(a.created_at);
		}
		return a.done ? 1 : -1;
	}) as task (task.id)}
		<div id="tasks">
			<div class="task" class:done={task.done}>
				<input
					type="checkbox"
					id="task_{task.id}"
					on:click={() => tasks.toggle(task, $user?.id)}
					checked={task.done}
				/>
				<label for="task_{task.id}">{task.text}</label>
				<button class="delete" type="button" on:click={() => tasks.delete(task, $user?.id)}>
					<Icon icon="iconamoon:close-bold" height="20" width="20" />
				</button>
			</div>
		</div>
	{/each}
</div>

<style lang="less">
	@import '../variables.less';

	.checklist {
		@media @s-nm {
			width: 275px;
		}
		.title-row {
			display: flex;
			align-items: center;
			gap: 10px;

			h1 {
				flex-grow: 1;
				margin-top: 10px;
				margin-bottom: 10px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

			button.delete {
				background-color: transparent;
				color: var(--textC);
				border: none;
				outline: none;
				font-size: 1.3em;
				display: flex;
				align-items: center;
				padding-bottom: 3px;
				cursor: pointer;
				&:hover,
				&:focus {
					color: var(--accentC);
				}
			}
		}

		form {
			input#new-task {
				font-family: var(--fontFamily1);
				background-color: var(--bgC2);
				color: var(--textC3);
				outline: 0;
				border: 0;
				border-radius: var(--bdRadius);
				padding: 10px 15px;
				font-size: 1em;
				font-weight: 300;
				width: 100%;
			}
		}
		hr {
			width: 100%;
			background-color: var(--bdC);
			height: 1px;
			border: transparent;
			margin: 20px 0;
		}
		#tasks {
			width: 100%;

			.task {
				display: flex;
				position: relative;
				width: 100%;
				border-radius: var(--bdRadius);

				input[type='checkbox'] {
					position: absolute;
					opacity: 0;
					&:checked + label {
						opacity: 0.6;
						text-decoration: line-through;
						color: var(--accentC);
					}
				}
				label {
					padding: 10px 15px;
					width: 100%;
					height: 100%;
					font-size: 0.9em;
					cursor: pointer;
				}
				&.done {
					button.delete {
						visibility: visible;
					}
				}
				&:not(.done) {
					button.delete {
						visibility: hidden;
					}
					&:hover,
					&:focus-within {
						button.delete {
							visibility: visible;
						}
					}
				}
				button.delete {
					width: 35px;
					background-color: transparent;
					color: var(--textC);
					border: none;
					outline: none;
					font-size: 1.3em;
					display: flex;
					align-items: center;
					padding-bottom: 3px;
					cursor: pointer;

					&:hover,
					&:focus {
						color: var(--accentC);
					}
				}

				&:hover,
				&:focus-within {
					@media @s-d {
						background-color: var(--bgC2);
						button.delete {
							opacity: 1;
						}
					}
				}
			}
		}
	}
</style>
