import type { Bar } from './charting_library/charting_library';

export interface SourceRecord {
	datetime: string;
	close: number;
}

export function processSourceRecords(records: SourceRecord[]): Bar[] {
	const bars = [];
	for (let i = 1; i < records.length - 1; i++) {
		const el = records[i];
		const prev = records[i - 1];
		// const next = records[i + 1];

		const time = new Date(el.datetime).getTime();
		const bar = {
			time: time, //TradingView requires bar time in ms
			low: el.close,
			high: el.close,

			open: prev.close,
			close: el.close
			// volume: 0
		};
		bars.push(bar);
	}

	return bars;
}

