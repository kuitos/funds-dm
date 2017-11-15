/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-11-02
 */

import { credential, database, initializeApp, ServiceAccount } from 'firebase-admin';
import * as secret from '../../secret.json';

initializeApp({
	credential: credential.cert(secret as ServiceAccount),
	databaseURL: 'https://funds-1de2d.firebaseio.com',
});

const db = database();

const dao = {

	add(path: string, payload: object): Promise<any> {
		return db.ref(path).set(payload);
	},

	delete(path: string): Promise<any> {
		return db.ref(path).remove();
	},

	update(path: string, payload: object): Promise<any> {
		return db.ref(path).update(payload);
	},

	async get<T>(path: string): Promise<T> {

		const snapshot = await db.ref(path).once('value');
		return snapshot.val();
	},

};

export default dao;
