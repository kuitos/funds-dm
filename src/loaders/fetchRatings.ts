/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-13
 */

import { decode } from 'iconv-lite';
import http from './http';
import evalResponse from '../utils/evalResponse';
import { RatingFund } from '../interfaces/RatingFund';

const ratingsUrl = 'http://fund.jrj.com.cn/action/jjpj/jjpjdata.jspa';
const jsonpResponsePrefix = 'var V_JRJ_FUND_MSTAR=';

interface RatingResponse {
	FUND_CODE: string,
	FUNDSNAME: string,
	STARS_5YEAR: string,
	STARS_3YEAR: string,
}

export async function fetchRatings(sampleSize: number): Promise<RatingFund[]> {

	const date = new Date();
	const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	const params = {
		from: 'V_JRJ_FUND_MSTAR',
		endDate: now
	};

	console.log('fetching rating start...', JSON.stringify(params));

	const response: string = await http.get(ratingsUrl, {params, responseType: 'arraybuffer'}).then(res => decode(res.data, 'gbk'));
	const ratings = (evalResponse<RatingResponse[]>(jsonpResponsePrefix, response) || []).slice(0, sampleSize);

	console.log('fetching rating end..., data length:', ratings.length);

	return ratings.map<RatingFund>(fund => ({
		no: fund.FUND_CODE,
		name: fund.FUNDSNAME,
		mstar: fund.STARS_3YEAR.length,
	}));

}