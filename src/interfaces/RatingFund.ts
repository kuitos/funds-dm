/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */
import { IFund } from './Fund';

export interface IRatingFund extends IFund {
	mstar?: number;  // 晨星评级
	shStar?: number; // 上海证券
	cmbStar?: number; // 招商证券
	jajxStar?: number; // 济安金信
	perfectCount?: number; // 五星评级家数
}
