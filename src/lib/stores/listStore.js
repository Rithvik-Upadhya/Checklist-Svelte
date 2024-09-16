import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';

export const selectedList = writable(null);
export const lists = createListsStore();

function createListsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        load: async (user_id = false) => {
            if (user_id) {
                const { data, error } = await supabase
                    .from('checklists')
                    .select()
                    .eq('user_id', user_id);
                if (error) {
                    console.error('Error loading lists:', error);
                } else {
                    set(data);
                }
            } else {
                if (browser) {
                    set(JSON.parse(localStorage.getItem('lists') || '[]'));
                }
            }
        },
        add: async (name, user_id) => {
            if (user_id) {
                const { data, error } = await supabase
                    .from('checklists')
                    .insert({ name, user_id })
                    .select();
                if (error) {
                    console.error('Error saving list:', error);
                } else {
                    update(lists => [...lists, data[0]]);
                }
            } else {
                if (browser) {
                    update(lists => {
                        const newList = { id: crypto.randomUUID(), created_at: new Date().toISOString(), name, last_updated: new Date().toISOString() };
                        const newLists = [...lists, newList];
                        localStorage.setItem('lists', JSON.stringify(newLists));
                        return newLists;
                    });
                }
            }
        }
    };
}