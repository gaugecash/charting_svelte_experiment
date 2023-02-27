import type { IBasicDataFeed, OnReadyCallback } from './charting_library/charting_library';

const config = {
	supported_resolutions: ['D', 'W', 'M', '3M', 'Y']
};

const symbols = ['AUD', 'CAD', 'CHF', 'EUR', 'GAU', 'GBP'];

export const datafeed: IBasicDataFeed = {
	onReady: (cb: OnReadyCallback) => {
		console.log('=====onReady running');
		setTimeout(() => cb(config), 0);
	},

	searchSymbols: (userInput, exchange, symbolType, cb) => {
		console.log('====Search Symbols running');
		const input = userInput.trim().toLowerCase();

		const results = symbols
			.filter((el) => {
				if (input.length == 1) {
					return true;
				}
				return el.toLowerCase().includes(input);
			})
			.map((el) => {
				return {
					symbol: el,
					full_name: el + ':USD',
					description: el + ':USD',
					exchange: el != 'GAU' ? 'OpenExchangeRates' : 'Index',
					ticker: el,
					type: el != 'GAU' ? 'fiat' : 'crypto'
				};
			});

		cb(results);
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		console.log('======resolveSymbol running: ' + symbolName);
		var symbol_stub = {
			name: symbolName,
			description: symbolName + ':USD',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: 'Custom',
			minmov: 1,
			// 1.738999003 => 1000000000
			//
			pricescale: 1000000000,
			has_intraday: false,
			// intraday_multipliers: ["1", "60"],
			supported_resolution: config.supported_resolutions,
			volume_precision: 8,
			data_status: 'streaming'
		};
		setTimeout(function () {
			onSymbolResolvedCallback(symbol_stub);
			// console.log('Resolving that symbol....', symbol_stub);
		}, 0);
	},

	getBars: async (symbolInfo, resolution, periodParams, onResult, onError) => {
		console.log(symbolInfo.name);
		const symbol = symbolInfo.name.toLowerCase();
		const data = await fetch('/api/get?crypto=' + symbol);
		const json = await data.json();

		var bars = [];
		for (let i = 1; i < json.length - 1; i++) {
			const el = json[i];
			const prev = json[i - 1];
			const next = json[i + 1];

			const time = new Date(el.datetime).getTime();
			const bar = {
				time: time, //TradingView requires bar time in ms
				low: Math.min(prev.close, next.close),
				high: Math.max(prev.close, next.close),

				open: el.close,
				close: el.close
				// volume: 0
			};
			bars.push(bar);
		}
		console.log(bars);
		onResult(bars);
	},

	subscribeBars: (
		symbolInfo,
		resolution,
		onRealtimeCallback,
		subscribeUID,
		onResetCacheNeededCallback
	) => {}
	// unsubscribeBars: (subscriberUID) => {},
	//
	// /* optional methods */
	// getServerTime: (cb) => {},
	// calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},
	// getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
	// getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}
};

interface SourceRecord {
	datetime: string;
	close: number;
}
