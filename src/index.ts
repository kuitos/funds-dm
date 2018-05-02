/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-03
 */

import { scheduleJob } from 'node-schedule';
import start from './schedulers/recommends';

console.info('app initialized!');
// 每天7点执行数据抓取任务
scheduleJob({hour: 7, minute: 0, dayOfWeek: [0, 1, 2, 3, 4, 5, 6]}, async () => {

	try {

		console.info('data mining job start...');
		await start();
		console.info('congratulation: data mining done!');

	} catch (e) {
		console.error('error occurs when job executing', e);
	}
});

