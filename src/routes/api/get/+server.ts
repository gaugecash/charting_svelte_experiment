import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const crypto = url.searchParams.get('crypto');

	if (crypto == '' || crypto == null) {
		throw error(400, 'crypto is none');
	}

	const data = await fetch('https://oxr-data-server-mqoo.vercel.app/' + crypto + 'usd');
	const j = await data.text();

	return new Response(j);
}) satisfies RequestHandler;
