'use server';

import { kv } from '@vercel/kv';
import { SESSION_TTL } from '@/app/constants/constants';

interface SessionInfo {
	expires: number;
	userId: string;
}

export const createSession = async ({
	userId,
}: {
	userId: string;
}) => {
	await deleteExpiredSessions();

	let sessionId = '';
	do {
		sessionId = Math.random().toString(36).slice(2);
	} while (await kv.get(sessionId));

	await kv.set(sessionId, {
		expires: Date.now() + SESSION_TTL,
		userId,
	});

	return sessionId;
};

export const isSessionValid = async ({
	sessionId,
}: {
	sessionId: string;
}) => {
	const sessionInfo = (await kv.get(sessionId)) as SessionInfo;
	if (!sessionInfo) {
		return false;
	};

	if (sessionInfo.expires < Date.now()) {
		await kv.del(sessionId);
		return false;
	}

	return true;
};

export const deleteExpiredSessions = async () => {
	const allKeys = await kv.scan('*');

	for (const key of allKeys) {
		const keyString = key as string;
		const sessionInfo = (await kv.get(keyString)) as SessionInfo;
		if (sessionInfo && sessionInfo.expires && sessionInfo.expires <= Date.now()) {
			await kv.del(keyString);
		}
	}
};