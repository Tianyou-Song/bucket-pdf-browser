'use client';

import Link from 'next/link';
import React, { use, useEffect } from 'react';
import { callLoginUser, checkIsSessionValid } from '@/app/actions/client-auth';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
	const router = useRouter();
	const [userName, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');

	useEffect(() => {
		const checkSession = async () => {
			const sessionValid = await checkIsSessionValid();
			if (sessionValid) {
				router.push('/player');
			}
		};
		checkSession();
	}, [router]);

	const hangleSubmit = async () => {
		const loggedIn = await callLoginUser({ userName, password });
		if (loggedIn) {
			router.push('/player');
		}
	};

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen min-w-screen gap-8"
		>
			<h1
				className="text-4xl"
			>
				Login
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
				<button
					className='bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-4 py-2 rounded mt-8'
					type="submit"
					onClick={hangleSubmit}
				>
					Login
				</button>
				<Link
					className="text-blue-400 hover:underline active:text-red-400 mt-8"
					href="/register"
				>
					Register
				</Link>
			</form>

		</div>
	);
};

export default LoginPage;