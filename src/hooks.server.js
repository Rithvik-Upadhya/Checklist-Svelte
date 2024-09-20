export async function handle({ event, resolve }) {
    const response = await resolve(event);
    
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
	return response;
}