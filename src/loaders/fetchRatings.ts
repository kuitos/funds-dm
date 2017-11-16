/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */

import { decode } from 'iconv-lite';
import { intersectionBy, merge } from 'lodash';
import { IRatingFund } from '../interfaces/RatingFund';
import evalResponse from '../utils/evalResponse';
import http from './http';

const mstarRatingsUrl = 'http://fund.jrj.com.cn/action/jjpj/jjpjdata.jspa';
const jsonpResponsePrefix = 'var V_JRJ_FUND_MSTAR=';
const otherRatingsUrl = 'http://fund.eastmoney.com/data/fundrating.html';
const otherRatingResponsePrefix = 'var fundinfos = ';

interface IRatingResponse {
	FUND_CODE: string;
	FUNDSNAME: string;
	STARS_5YEAR: string;
	STARS_3YEAR: string;
}

async function fetchMstarRatings(sampleSize: number): Promise<IRatingFund[]> {

	const date = new Date();
	const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	const params = {
		from: 'V_JRJ_FUND_MSTAR',
		endDate: now,
	};

	const response: string = await http.get(mstarRatingsUrl, {params, responseType: 'arraybuffer'})
		.then((res) => decode(res.data, 'gbk'));
	const ratings = (evalResponse<IRatingResponse[]>(jsonpResponsePrefix, response) || []).slice(0, sampleSize);

	return ratings.map<IRatingFund>(fund => ({
		no: fund.FUND_CODE,
		name: fund.FUNDSNAME,
		mstar: fund.STARS_3YEAR.length,
	}));
}

async function fetchMoreRatings(): Promise<IRatingFund[]> {

	const html: string = await http.get(otherRatingsUrl).then(res => res.data);
	const fundInfoReg: RegExp = /^var fundinfos = "((?:\\.|[^"\\])*)";/gm;
	const fundInfo = (html.match(fundInfoReg) || ['var fundinfos = "";'])[0];

	const fundInfoString = evalResponse<string>(otherRatingResponsePrefix, fundInfo) || '';
	const fundsInString = fundInfoString.split('|_');
	const funds = fundsInString.map<IRatingFund>(fund => {
		const info = fund.split('|');
		return {
			no: info[0],
			name: info[1],
			shStar: Number(info[12]),
			cmbStar: Number(info[10]),
			jajxStar: Number(info[16]),
			perfectCount: Number(info[7]),
		};
	});

	return funds;
}

export async function fetchAllRatings(sampleSize: number): Promise<IRatingFund[]> {

	console.info('fetching rating start... smaple size:', sampleSize);

	const [mstarRatings, ratings] = await Promise.all([fetchMstarRatings(sampleSize), fetchMoreRatings()]);
	const intersection = intersectionBy(mstarRatings, ratings, 'no');
	const funds = intersection
		.map(fund => {

			const mergedFund = merge(fund, ratings.find(v => v.no === fund.no));
			mergedFund.perfectCount = (mergedFund.mstar === 5 ? 1 : 0) + (mergedFund.perfectCount || 0);
			return mergedFund;
		});

	console.info('fetching rating end..., data length:', funds.length);

	return funds;
}
