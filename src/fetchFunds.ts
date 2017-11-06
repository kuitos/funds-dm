/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-06
 */
import axios from 'axios';
import evalResponse from './evalResponse';

const http = axios.create({
	baseURL: '/',
	headers: {
		'Cache-Control': 'no-cache'
	}
});

const fundsUrl = 'http://fund.eastmoney.com/data/rankhandler.aspx';

export interface Fund {
	no: string,
	name: string,
	NAV: number, // 单位净值
	ACCNAV: number, // 累计净值
	last1Month: number,
	last3Month: number,
	last6Month: number,
	last1Year: number,
	last2Year: number,
	last3Year: number
}

export async function fetchFunds(sc: string = '1nzf'): Promise<Array<Fund>> {

	const params = {
		op: 'ph',
		dt: 'kf',
		ft: 'all',
		sc,
		st: 'desc',
		sd: '2016-11-03',
		ed: '2017-11-03',
		tabSubtype: ',,,,,',
		pi: 1,
		pn: 200,
		dx: 1
	};

	console.log('fetching start...', JSON.stringify(params));
	const response: string = await http.get(fundsUrl, {params}).then(res => res.data);
	const funds = evalResponse(response).datas;

	console.log(funds.length);

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
