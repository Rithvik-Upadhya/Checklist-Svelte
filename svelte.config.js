import adapter from '@sveltejs/adapter-netlify';
import { sveltePreprocess } from 'svelte-preprocess';

const config = {
    preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter({
            // if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: false,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			split: false
        }),
        csp: {
            mode: 'auto',
            directives: {
                'script-src': ['self'],
                'frame-ancestors': ['self']
            }
        }
	}
};

export default config;
