import { persistentAtom, persistentMap } from '@nanostores/persistent';
import type { SourceRecord } from './data';

export const dataCache = persistentAtom<Map<string, SourceRecord[]>>('data_cache', new Map(), {
	encode: (data) => {
		return JSON.stringify(Object.fromEntries(data));
	},
	decode: (json) => {
		return new Map(Object.entries(JSON.parse(json)));
	}
});

// export const settings = persistentMap<Record<string, SourceRecord[]>>('settings:', {
// 	sidebar: 'show',
// 	theme: 'auto'
// });

// export function addToCache(key: string, val: SourceRecord[]) {
// 	const temp = dataCache.get();
// 	temp.set(key, val);
// 	dataCache.set(temp);
// }
