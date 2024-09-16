import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';

function createListsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        load: async (user_id = false) => {
            if (user_id) {
                const { data, error } = await supabase
                    .from('checklists')
                    .select('name')
                    .eq('user_id', user_id);
                if (error) {
                    console.error('Error loading lists:', error);
                } else {
                    console.log('lists', data);
                    set(data.map(item => item.name));
                }
            } else {
                if (browser) {
                    set(JSON.parse(localStorage.getItem('lists') || '[]'));
                }
            }
        },
        add: async (name, user_id) => {
            if (user_id) {
                const { error } = await supabase
                    .from('checklists')
                    .insert({ name, user_id });
                if (error) {
                    console.error('Error saving list:', error);
                } else {
                    update(lists => [...lists, name]);
                }
            } else {
                if (browser) {
                    update(lists => {
                        const newLists = [...lists, name];
                        localStorage.setItem('lists', JSON.stringify(newLists));
                        return newLists;
                    });
                }
            }
        }
    };
}

export const lists = createListsStore();