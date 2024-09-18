import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const user = writable(null);

export async function initializeUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        user.set(session.user);
    }
}