/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-06
 */
import evalResponse from '../utils/evalResponse';
import http from './http';
import { BaseFund } from '../interfaces/BaseFund';

const fundsUrl = 'dao://fund.eastmoney.com/data/rankhandler.aspx';
const jsonpResponsePrefix = 'var rankData =';

export interface FundsPagination {
	datas: Array<string>
}

export async function fetchFunds(sc: string = '1nzf', sampleSize: number): Promise<BaseFund[]> {

	const date = new Date();
	const now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	const params = {
		op: 'ph',
		dt: 'kf',
		ft: 'all',
		sc,
		st: 'desc',
		sd: now,
		ed: now,
		tabSubtype: ',,,,,',
		pi: 1,
		pn: sampleSize,
		dx: 1
	};

	console.log('fetching funds start...', JSON.stringify(params));

	const response: string = await http.get(fundsUrl, {params}).then(res => res.data);
	const funds = (evalResponse<FundsPagination>(jsonpResponsePrefix, response) || {datas: []}).datas;

	console.log('fetching funds end..., data length:', funds.length);

	return funds.map(fund => {

		const [no, name, , , NAV, ACCNAV, , , last1Month, last3Month, last6Month, last1Year, last2Year, last3Year] = fund.split(',');

		return {
			no,
			name,
			NAV: Number(NAV),
			ACCNAV: Number(ACCNAV),
			last1Month: Number(last1Month),
			last3Month: Number(last3Month),
			last6Month: Number(last6Month),
			last1Year: Number(last1Year),
			last2Year: Number(last2Year),
			last3Year: Number(last3Year)
		};

	});
}
