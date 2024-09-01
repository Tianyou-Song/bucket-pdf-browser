'use server';

import { sql } from '@vercel/postgres';
import { addUser, deleteInviteCode, getUser, inviteCodeExists } from '@/app/actions/db';
import _ from 'lodash';
import { createSession } from '@/app/actions/kv';
import { hashUserPasswordServerSide } from '@/app/utils/serverUtils';

export const registerUser = async ({
	userName,
	passwordHash,
	inviteCode,
}: {
	userName: string;
	passwordHash: string;
	inviteCode: string;
}) => {

	if (!userName || !passwordHash || !inviteCode) {
		return {
			message: 'Missing required fields',
		};
	};

	const passwordHash2 = await hashUserPasswordServerSide({
		userName,
		passwordHash,
	});

	console.log('passwordHash2', passwordHash2);

	try {
		await sql`BEGIN`;

		console.log('11111111111111111111');

		const codeIsValid = await inviteCodeExists(inviteCode);
		if (!codeIsValid) throw new Error('Invalid invite code');

		await Promise.all([
			addUser({ userName, passwordHash: passwordHash2 }),
			deleteInviteCode(inviteCode),
		]);

		await sql`COMMIT`;

		console.log('22222222222222222222');

		return {
			message: 'success',
		};

	} catch (error) {
		await sql`ROLLBACK`;

		console.log({
			message: _.get(error, 'message', 'An error occurred'),
		});

		return {
			message: _.get(error, 'message', 'An error occurred'),
		};
	}
};

export const loginUser = async ({
	userName,
	passwordHash,
}: {
	userName: string;
	passwordHash: string;
}) => {
	if (!userName || !passwordHash) {
		return {
			error: 'Missing required fields',
		};
	};

	const passwordHash2 = await hashUserPasswordServerSide({
		userName,
		passwordHash,
	});

	const user = await getUser({
		userName,
		passwordHash: passwordHash2,
	});

	if (!user) {
		return {
			error: 'Invalid credentials',
		};
	};

	const sessionId = await createSession({ userId: user.id });

	return {
		sessionId,
	};
};