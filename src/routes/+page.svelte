<script lang="ts">
	import { widget } from '$lib/charting_library';
	import { onMount } from 'svelte';
	import { datafeed } from '$lib/datafeed';

	let chartContainer: HTMLDivElement;

	onMount(() => {
		const widgetOptions = {
			debug: false,
			fullscreen: true,
			container: chartContainer,

			symbol: 'GAU',
			interval: 'W',
			// timeframe: '',

			datafeed: datafeed,
			library_path: '$lib/charting_library/',
			locale: 'en',

			disabled_features: ['use_localstorage_for_settings'],
			enabled_feeatures: ['study_templates'],
			charts_storage_url: 'https://saveload.tradingview.com',
			charts_storage_api_version: '1.1',

			client_id: 'tradingview.com',
			user_id: 'public_user_id',
			theme: 'Dark'
		};

		let w = new widget(widgetOptions);

		// w.chart().createStudy('Compare', false, false, ["open", 'GAU']);
	});
</script>

<div class="TVChartContainer" bind:this={chartContainer} />
