import { writable } from 'svelte/store';

function createToastStore() {
    const { subscribe, update } = writable([]);

    let id = 0;

    function addToast(message, type = 'info', duration = 5000) {
        const toastMessage = { id: ++id, message, type, duration };
        update(messages => [...messages, toastMessage]);

        if (duration > 0) {
            setTimeout(() => removeToast(toastMessage.id), duration);
        }
    }

    function removeToast(id) {
        update(messages => messages.filter(m => m.id !== id));
    }

    return {
		subscribe,
		add: addToast,
		info: (msg, duration) => addToast(msg, 'info', duration),
		success: (msg, duration) => addToast(msg, 'success', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        remove: removeToast
    };
}

export const toastStore = createToastStore();