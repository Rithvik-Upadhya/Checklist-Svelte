import { lists, selectedList } from '$lib/stores/listStore';
import { user } from '$lib/stores/authStore';
import { get } from 'svelte/store';

export async function load({ params }) {
    const slug = params.slug;
    if (slug) {
        const currentUser = get(user);
        const list = await lists.loadList(slug, currentUser?.id);
		if (list) {
			selectedList.set(list);
		}
	}
}