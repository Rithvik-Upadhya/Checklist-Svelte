import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from '$lib/stores/auth';
import { get } from 'svelte/store';

function createListsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        load: async () => {
            const currentUser = get(user);
            if (currentUser) {
                const { data, error } = await supabase
                    .from('checklists')
                    .select('name')
                    .eq('user_id', currentUser.id);
                console.log('Loaded data:', data); // Add this line
                if (error) {
                    console.error('Error loading lists:', error);
                } else {
                    set(data.map(item => item.name));
                }
            } else {
                set(JSON.parse(localStorage.getItem('lists') || '[]'));
            }
        },
        add: async (name) => {
            const currentUser = get(user);
            if (currentUser) {
                const { error } = await supabase
                    .from('checklists')
                    .insert({ name, user_id: currentUser.id });
                if (error) {
                    console.error('Error saving list:', error);
                    return;
                }
            }
            update(lists => {
                const newLists = [...lists, name];
                if (!currentUser) {
                    localStorage.setItem('lists', JSON.stringify(newLists));
                }
                return newLists;
            });
        }
    };
}

export const listStore = createListsStore();