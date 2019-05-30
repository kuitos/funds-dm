/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */
import { readFile } from 'fs';
import { load } from 'js-yaml';
import { intersectionBy, merge } from 'lodash';
import * as path from 'path';
import { promisify } from 'util';
import { IBaseFund } from '../interfaces/BaseFund';
import { IFund } from '../interfaces/Fund';
import { IRatingFund } from '../interfaces/RatingFund';
import { fetchFunds } from '../loaders/fetchFunds';
import { fetchAllRatings } from '../loaders/fetchRatings';
import dao from '../utils/dao';

const readFilePromise: (path: string, encoding: string) => Promise<string> = promisify(readFile);

interface IndexedFund {
	[name: string]: IFund;
}

export default async function start() {

	const metadata = load(await readFilePromise(path.join(__dirname, '../../metadata.yml'), 'utf-8'));
	const { sampleSize } = metadata;

	const collection = await Promise.all([
		fetchFunds('6yzf', sampleSize),
		fetchFunds('1nzf', sampleSize),
		fetchFunds('2nzf', sampleSize),
		fetchFunds('3nzf', sampleSize),
		fetchAllRatings(sampleSize),
	]);

	// 根据基金 no 做交集处理
	const [, , , , ratings] = collection;
	// @ts-ignore
	const intersectedFunds: Array<IBaseFund & IRatingFund> = intersectionBy.apply(null, [...collection, 'no'])
		.map((v: IFund) => merge(v, ratings.find(rate => rate.no === v.no) || { mstar: 0 }))
		.filter((v: any) => v.perfectCount >= 2);

	const indexedFunds = intersectedFunds.reduce((a: IndexedFund, b: IFund) => {
		a[b.no] = b;
		return a;
	}, {});

	await dao.add('/recommendFunds', indexedFunds);
	await dao.update('/recommendFunds', { length: intersectedFunds.length });

	console.info(`${intersectedFunds.length} recommended funds saved!`);
}
