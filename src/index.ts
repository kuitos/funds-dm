/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-03
 */

import { readFile } from 'fs';
import { load } from 'js-yaml';
import { scheduleJob } from 'node-schedule';
import * as path from 'path';
import { promisify } from 'util';
import start from './schedulers/recommends';

console.info('app initialized!');

const readFilePromise: (path: string, encoding: string) => Promise<string> = promisify(readFile);

async function startJob() {
	try {

		console.info('data mining job start...');
		await start();
		console.info('congratulation: data mining done!');

	} catch (e) {
		console.error('error occurs when job executing', e);
	}
}

(async () => {
	const metadata = load(await readFilePromise(path.join(__dirname, '../metadata.yml'), 'utf-8'));

	const { fireImmediately } = metadata;
	if (fireImmediately) {
		console.info('job start immediately ----->');
		await startJob();
	}
})();

// 每天7点执行数据抓取任务
scheduleJob({ hour: 7, minute: 0, dayOfWeek: [0, 1, 2, 3, 4, 5, 6] }, startJob);
