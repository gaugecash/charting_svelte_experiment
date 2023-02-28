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
