'use client';

import { useEffect, useState } from 'react';
import { _Object } from '@aws-sdk/client-s3';
import Link from 'next/link';
import { checkIsSessionValid } from '@/app/actions/client-auth';
import  {useRouter } from 'next/navigation';
import { fetchListPlayerContents } from '@/app/actions/s3-client';

const PlayerPage = () => {
	const router = useRouter();
	const [files, setFiles] = useState<_Object[]>([]);

	useEffect(() => {
		const fetchFiles = async () => {
			const sessionValid = await checkIsSessionValid();
			if (!sessionValid) {
				router.push('/login');
				return;
			}

			try {
				const response = await fetchListPlayerContents();
				if (!response) {
					return;
				};
				const pdfs = response.filter((file) => {
					return (
						file.Key?.endsWith('.pdf') &&
						!file.Key?.includes('_')
					);
				}).sort((a, b) => {
					const aName = a.Key?.split('/').pop();
					const bName = b.Key?.split('/').pop();
					if (!aName || !bName) return 0;
					const aTrimmedFileName = aName.split('.').slice(0, -1).join('.');
					const bTrimmedFileName = bName.split('.').slice(0, -1).join('.');
					return aTrimmedFileName.localeCompare(bTrimmedFileName);
				});

				setFiles(pdfs);
			} catch (error) {
				console.error('Error fetching files:', error);
			}
		};

		fetchFiles();
	}, [router]);

	const renderFile = (file: _Object) => {
		const fileName = file.Key?.split('/').pop();
		if (!fileName || !file.Key) return null;
		const trimmedFileName = fileName.split('.').slice(0, -1).join('.');
		const fileNameHref = trimmedFileName.replace(/ /g, '_');

		return (
			<Link
				href={`player/${fileNameHref}`}
				className="text-xl text-blue-400 hover:underline active:text-red-400"
			>
				{trimmedFileName}
			</Link>
		);
	};

	return (
		<div
			className="flex flex-col items-center gap-8 min-w-screen min-h-screen justify-center"
		>
			<h1
				className="text-2xl font-bold"
			>
				Player Resrouces
			</h1>
			{files.length ?
				<ul
					className="flex flex-col gap-4"
				>
					{files.map(file => (
						<li key={file.Key}>
							{renderFile(file)}
						</li>
					))}
				</ul>
				:
				<div>
					loading...
				</div>
			}
		</div>
	);
};

export default PlayerPage;