/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-03
 */

import { intersectionBy } from 'lodash';
import { fetchFunds, Fund } from './fetchFunds';
import http from './http';

interface indexedFund {
	[name: string]: Fund
}

(async () => {

	const responseWith6MonthPromise = fetchFunds('6yzf');
	const responseWith1YearPromise = fetchFunds('1nzf');
	const responseWith2YearPromise = fetchFunds('2nzf');
	const responseWith3YearPromise = fetchFunds('3nzf');

	const collection = await Promise.all([responseWith6MonthPromise, responseWith1YearPromise, responseWith2YearPromise, responseWith3YearPromise]);
	const intersectedFunds = intersectionBy.apply(null, [...collection, 'no']);

	const indexedFunds = intersectedFunds.reduce((a: indexedFund, b: Fund) => {
		a[b.no] = b;
		return a;
	}, {});

	await http.add('/recommendFunds', indexedFunds);
	console.log('add succeed!');

})();
