/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-03
 */

import { scheduleJob } from 'node-schedule';
import start from './schedulers/recommends';

try {

	console.info('data mining job start...');

	// 每天3点执行数据抓取任务
	scheduleJob({hour: 3}, async () => {
		await start();
		console.info('congratulation: data mining done!');
	});
} catch (e) {
	console.error('error occurs when job executing', e);
}
