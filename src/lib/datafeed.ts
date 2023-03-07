import { dataCache } from './atoms';
import type { IBasicDataFeed, OnReadyCallback } from './charting_library/charting_library';
import { processSourceRecords, type SourceRecord } from './data';

const config = {
	supported_resolutions: ['D', 'W', 'M', '3M', 'Y']
};

// gauusd, eurusd, chfusd, audusd, cadusd, cnyusd, hkdusd, nzdusd, sekusd, krwusd, sgdusd, nokusd, mxnusd, inrusd, rubusd, zarusd, tryusd, brlusd, twdusd, dkkusd, plnusd, thbusd, idrusd, hufusd, czkusd, ilsusd, clpusd, phpusd, copusd, myrusd, ronusd, penusd, arsusd, bgnusd
const symbols = ['GAU', 'EUR', 'CHF', 'AUD', 'CAD', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL', 'TWD', 'DKK', 'PLN', 'THB', 'IDR', 'HUF', 'CZK', 'ILS', 'CLP', 'PHP', 'COP', 'MYR', 'RON', 'PEN', 'ARS', 'BGN'];

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
		console.log('Trying to recover from cache');
		const symbol = symbolInfo.name.toLowerCase();

		let records: SourceRecord[];
		const cache = dataCache.get();

		if (cache.has(symbol)) {
			console.log('There is a cache!');
			records = cache.get(symbol)!;
		} else {
			const data = await fetch('/api/get?crypto=' + symbol);
			records = await data.json();

			cache.set(symbol, records);
			dataCache.set(cache);

			console.log('Cache saved');
		}

		const bars = processSourceRecords(records);

		// console.log(bars);
		const to = periodParams.to * 1000;
		const from = periodParams.from * 1000;

		const filtered = bars.filter((el) => {
			return el.time >= from && el.time <= to;
		});

		console.log('== INFO ==');
		console.log('from, to: ', periodParams.from, periodParams.to);
		console.log('requested: ', periodParams.countBack);
		console.log('given: ', filtered.length);

		// if (filtered.length == 0) {
		// 	onResult(bars, { noData: bars.length == 0 });
		// } else {
		onResult(filtered, { noData: bars.length == 0 });
		// }
	},

	subscribeBars: (
		symbolInfo,
		resolution,
		onRealtimeCallback,
		subscribeUID,
		onResetCacheNeededCallback
	) => {},
	unsubscribeBars: (subscriberUID) => {},
	//
	// /* optional methods */
	getServerTime: (cb) => {},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},
	getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}
};
