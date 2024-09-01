'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { callRegisterUser, checkIsSessionValid } from '@/app/actions/client-auth';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
	const router = useRouter();
	const [userName, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [inviteCode, setInviteCode] = React.useState('');

	useEffect(() => {
		const checkSession = async () => {
			const sessionValid = await checkIsSessionValid();
			if (sessionValid) {
				router.push('/player');
			}
		};
		checkSession();
	}, [router]);

	const handleSubmit = async () => {
		const registered = await callRegisterUser({ userName, password, inviteCode });
		console.log('registered', registered);
		if (registered) {
			router.push('/login');
		}
	};

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen min-w-screen gap-8"
		>
			<h1
				className="text-4xl"
			>
				Register
			</h1>
			<form
				className="flex flex-col items-center"
			>
				<label
					className="mt-4 self-start"
				>
					Username
				</label>
				<input
					className="border border-gray-400 rounded px-4 py-2 bg-gray-800 text-white"
					type="text"
					placeholder="Username"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>

				<label
					className="mt-4 self-start"
				>
					Password
				</label>
				<input
					className="border border-gray-400 rounded px-4 py-2 bg-gray-800 text-white"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<label
					className="mt-4 self-start"
				>
					Invite Code
				</label>
				<input
					className="border border-gray-400 rounded px-4 py-2 bg-gray-800 text-white"
					type="text"
					placeholder="Invite Code"
					value={inviteCode}
					onChange={(e) => setInviteCode(e.target.value)}
				/>
				<button
					className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-4 py-2 rounded mt-8'
					type="submit"
					onClick={handleSubmit}
				>
					Register
				</button>
				<Link
					className="text-blue-400 hover:underline active:text-red-400 mt-8"
					href="/login"
				>
					Log In
				</Link>
			</form>

		</div>
	);
};

export default RegisterPage;