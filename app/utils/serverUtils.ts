'use server';

import crypto from 'crypto';

export const hashUserPasswordServerSide = async ({
	userName,
	passwordHash,
}: {
	userName: string;
	passwordHash: string;
}) => {
	return crypto.createHash('sha256').update(passwordHash + userName).digest('hex');
};
