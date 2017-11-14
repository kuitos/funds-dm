/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-06
 */

export default function evalResponse<T>(prefix: string, literal: string): T | null {

	// 构建赋值语句
	let acceptedVariable = null;
	const assignment = `acceptedVariable = ${literal.substring(prefix.length).trim()}`;
	eval(assignment);
	return acceptedVariable;
}