'use client';

import { getFileUrl } from './s3.actions';

export const fetchFileUrl = async (fileKey: string) => {
	try {
		const fileUrl = await getFileUrl(fileKey);
		return fileUrl;
	} catch (error) {
		console.error('Error fetching file URL:', error);
	}
};

export const fetchFile = async (fileKey: string) => {
	try {
		const fileUrl = await getFileUrl(fileKey);

		const { body } = await fetch(fileUrl);
		if (!body) return null;
		const reader = body.getReader();
		const chunks = [];
		let done, value;

		while (!done) {
			({ done, value } = await reader.read());
			if (value) {
				chunks.push(value);
			}
		}

		const length = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
		const uint8Array = new Uint8Array(length);
		let offset = 0;
		for (const chunk of chunks) {
			uint8Array.set(chunk, offset);
			offset += chunk.length;
		}

		return uint8Array;
	} catch (error) {
		console.error('Error fetching file:', error);
	}
};