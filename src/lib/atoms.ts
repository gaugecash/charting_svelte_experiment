import { persistentAtom } from '@nanostores/persistent';
import type { SourceRecord } from './data';

export interface CacheEntry {
	expireEpoch: number;
	data: SourceRecord[];
}

export const dataCache = persistentAtom<Map<string, CacheEntry>>('data_cache_v2', new Map(), {
	encode: (data) => {
		return JSON.stringify(Object.fromEntries(data));
	},
	decode: (json) => {
		return new Map(Object.entries(JSON.parse(json)));
	}
});


