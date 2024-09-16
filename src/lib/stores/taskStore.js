import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';

export const createTasksStore = () => {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        load: async (list, user_id = false) => {
            if (user_id) {
                    const { data, error } = await supabase
                    .from('tasks')
                    .select()
                    .eq('checklist_id', list.id);
                if (error) {
                    console.error('Error loading tasks:', error);
                } else {
                    set(data);
                }
            } else {
                if (browser) {
                    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
                    const tasks = allTasks.filter(t => t.checklist_id === list.id);
                    set(tasks);
                }
            }
        },
        add: async (taskText, list, user_id = false) => {
            if (user_id) {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([{ text: taskText, checklist_id: list.id, user_id: user_id }])
                    .select();
                if (error) {
                    console.error('Error adding task:', error);
                } else {
                    update(tasks => [...tasks, data[0]]);
                }
            } else {
                if (browser) {
                    update(tasks => {
                        const newTask = { id: crypto.randomUUID(), text: taskText, done: false, checklist_id: list.id, created_at: new Date().toISOString() };
                        const updatedTasks = [...tasks, newTask];
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        return updatedTasks;
                    });
                }
            }
        },
        toggle: async (task, user_id = false) => {
            if (user_id) {
                const { _, error } = await supabase
                .from('tasks')
                .update({ done: !task.done })
                .eq('id', task.id);

                if (error) {
                    console.error('Error toggling task:', error);
                } else {
                    update(tasks => tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t));
                }
            } else {
                if (browser) {
                    update(tasks => {
                        const updatedTasks = tasks.map(t => t.id === task.id ? {...t, done: !Boolean(t.done)} : t);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        return updatedTasks;
                    });
                }
            }
        },
        delete: async (task, user_id = false) => {
            if (user_id) {
                const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', task.id);
            if (error) {
                console.error('Error deleting task:', error);
            } else {
                update(tasks => tasks.filter(t => t.id !== task.id));
                }
            } else {
                if (browser) {
                    update(tasks => {
                        const updatedTasks = tasks.filter(t => t.id !== task.id);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        return updatedTasks;
                    });
                }
            }
        }
    }
}
    
export const tasks = createTasksStore();