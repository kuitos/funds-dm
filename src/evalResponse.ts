/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-06
 */

export interface FundsPagination {
	datas: Array<string>
}

export default function evalResponse(literal: string): FundsPagination {

	// 构建赋值语句
	let acceptedVariable = {datas: []};
	const prefix = 'var rankData =';
	const assignment = `acceptedVariable = ${literal.substring(prefix.length).trim()}`;
	eval(assignment);
	return acceptedVariable;
}