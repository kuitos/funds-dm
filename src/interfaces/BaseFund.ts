/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */
import { IFund } from './Fund';

export interface IBaseFund extends IFund {
	NAV: number; // 单位净值
	ACCNAV: number; // 累计净值
	last1Month: number;
	last3Month: number;
	last6Month: number;
	last1Year: number;
	last2Year: number;
	last3Year: number;
}
