import { lists, selectedList } from '$lib/stores/listStore';
import { user, initializeUser } from '$lib/stores/authStore';
import { get } from 'svelte/store';

export async function load({ params }) {
    await initializeUser();
    const slug = params.slug;
    if (slug) {
        const currentUser = get(user);
        const list = await lists.loadList(slug, currentUser?.id);
		if (list) {
			selectedList.set(list);
		}
	}
}