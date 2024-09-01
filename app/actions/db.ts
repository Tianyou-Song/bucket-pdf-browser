'use server';

import { sql } from '@vercel/postgres';

export const inviteCodeExists = async (inviteCode: string) => {
	const { rows } = await sql`
		SELECT * FROM invites
		WHERE invite_code = ${inviteCode};
	`;

	return rows.length > 0;
};

export const deleteInviteCode = async (inviteCode: string) => {
	return sql`
		DELETE FROM invites
		WHERE invite_code = ${inviteCode};
	`;
};

export const addUser = async({
	userName,
	passwordHash,
}: {
	userName: string;
	passwordHash: string;
}) => {
	return sql`
		INSERT INTO users (user_name, password_hash)
		VALUES (${userName}, ${passwordHash})
	`;
};

export const getUser = async ({
	userName,
	passwordHash,
}: {
	userName: string;
	passwordHash: string;
}) => {
	const { rows } = await sql`
		SELECT * FROM users
		WHERE user_name = ${userName}
		AND password_hash = ${passwordHash};
	`;

	return rows[0];
};