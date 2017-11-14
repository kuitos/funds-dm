/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */
import { intersectionBy, merge } from 'lodash';
import { fetchFunds } from '../loaders/fetchFunds';
import { Fund } from '../interfaces/Fund';
import { fetchRatings } from '../loaders/fetchRatings';
import dao from '../utils/dao';
import { BaseFund } from '../interfaces/BaseFund';
import { RatingFund } from '../interfaces/RatingFund';

interface IndexedFund {
	[name: string]: Fund
}

export default async function start() {

	const sampleSize = 500;

	const collection = await Promise.all([
		fetchFunds('6yzf', sampleSize),
		fetchFunds('1nzf', sampleSize),
		fetchFunds('2nzf', sampleSize),
		fetchFunds('3nzf', sampleSize),
		fetchRatings(sampleSize),
	]);

	// 根据基金 no 做交集处理
	const [, , , , ratings] = collection;
	const intersectedFunds: Array<BaseFund & RatingFund> = intersectionBy.apply(null, [...collection, 'no'])
		.map((v: Fund) => merge(v, ratings.find(rate => rate.no === v.no) || {mstar: 0}))
		.filter((v: any) => v.mstar > 3);

	const indexedFunds = intersectedFunds.reduce((a: IndexedFund, b: Fund) => {
		a[b.no] = b;
		return a;
	}, {});

	await dao.add('/recommendFunds', indexedFunds);
	await dao.update('/recommendFunds', {length: intersectedFunds.length});

	console.log(intersectedFunds.length, ' recommended funds saved!');
}