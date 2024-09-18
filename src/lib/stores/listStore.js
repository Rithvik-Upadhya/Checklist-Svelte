import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';


function createSlug(name) {
    const randomChars = Math.random().toString(36).substring(2, 4);
    return randomChars + '-' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

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
        loadList: async (slug, user_id = false) => {
            if (user_id) {
                const { data, error } = await supabase
                    .from('checklists')
                    .select()
                    .eq('slug', slug)
                    .eq('user_id', user_id)
                    .single();
                if (error) {
                    console.error('Error loading list:', error);
                    return null;
                } else {
                    return data;
                }
            } else {
                if (browser) {
                    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
                    return lists.find(l => l.slug === slug) || null;
                }
            }
        },
        add: async (name, user_id) => {
            const slug = createSlug(name);
            if (user_id) {
                const { data, error } = await supabase
                    .from('checklists')
                    .insert({ name, user_id, slug })
                    .select();
                if (error) {
                    console.error('Error saving list:', error);
                } else {
                    update(lists => [...lists, data[0]]);
                }
            } else {
                if (browser) {
                    update(lists => {
                        const newList = { id: crypto.randomUUID(), created_at: new Date().toISOString(), name, last_updated: new Date().toISOString(), slug };
                        const newLists = [...lists, newList];
                        localStorage.setItem('lists', JSON.stringify(newLists));
                        return newLists;
                    });
                }
            }
        },
        delete: async (list, user_id) => {
            if (user_id) {
                const { error } = await supabase
                    .from('checklists')
                    .delete()
                    .eq('id', list.id)
                    .eq('user_id', user_id);
                if (error) {
                    console.error('Error deleting list:', error);
                } else {
                    update(lists => lists.filter(l => l.id !== list.id));
                }
            } else {
                if (browser) {
                    update(lists => {
                        const updatedLists = lists.filter(l => l.id !== list.id);
                        localStorage.setItem('lists', JSON.stringify(updatedLists));
                        return updatedLists;
                    });
                    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
                    allTasks = allTasks.filter(t => t.checklist_id !== list.id);
                    localStorage.setItem('tasks', JSON.stringify(allTasks));
                }
            }
        }   
    };
}