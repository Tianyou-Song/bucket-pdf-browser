'user client';

import { loginUser, registerUser } from '@/app/actions/auth';
import { isSessionValid } from '@/app/actions/kv';
import { hashUserPasswordClientSide } from '@/app/utils/clientUtils';

export const callRegisterUser = async ({
	userName,
	password,
	inviteCode,
}: {
	userName: string;
	password: string;
	inviteCode: string;
}) => {
	try {
		const passwordHash = hashUserPasswordClientSide({
			userName,
			password,
		});

		const response = await registerUser({
			userName,
			passwordHash,
			inviteCode,
		});

		if (response.message !== 'success') {
			alert(response.message);
			return false;
		}

		return true;
	} catch (error) {
		console.log('============================');
		console.error(error);
		return false;
	}
};

export const callLoginUser = async({
	userName,
	password,
}: {
	userName: string;
	password: string;
}) => {
	try {
		const passwordHash = hashUserPasswordClientSide({
			userName,
			password,
		});

		const response = await loginUser({
			userName,
			passwordHash,
		});

		if (response.error) {
			alert(response.error);
			return false;
		}

		if (!response.sessionId) {
			alert('An error occurred');
			return false;
		}

		localStorage.setItem('sessionId', response.sessionId);

		return true;
	} catch (error) {
		console.log('============================');
		console.error(error);
		return false;
	}
};

export const checkIsSessionValid = async () => {
	const sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		return false;
	}

	const isValid = await isSessionValid({
		sessionId,
	});

	if (!isValid) {
		localStorage.removeItem('sessionId');
		return false;
	}

	return true;
};
