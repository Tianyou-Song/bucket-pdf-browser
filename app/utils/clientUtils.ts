'use client';

import crypto from 'crypto';

export const hashUserPasswordClientSide = ({
	userName,
	password,
}: {
	userName: string;
	password: string;
}) => {
	return crypto.createHash('sha256').update(userName + password).digest('hex');
};
