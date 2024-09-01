'user client';

import { getFileUrl, listPlayerContents } from '@/app/actions/s3';

export const fetchListPlayerContents = async () => {
	const sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		return null;
	}
	const response = await listPlayerContents(sessionId);
	return response;
};

export const fetchFileUrl = async (key: string) => {
	const sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		return null;
	}
	const response = await getFileUrl({
		key,
		sessionId,
	});
	return response;
};
