'use client';

import { useEffect, useState } from 'react';
import { listPlayerContents } from '../actions/s3.actions';
import { _Object } from '@aws-sdk/client-s3';
import Link from 'next/link';

const PlayerPage = () => {
	const [files, setFiles] = useState<_Object[]>([]);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await listPlayerContents();
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
	}, []);

	const renderFile = (file: _Object) => {
		const fileName = file.Key?.split('/').pop();
		if (!fileName || !file.Key) return null;
		const trimmedFileName = fileName.split('.').slice(0, -1).join('.');
		const fileNameHref = trimmedFileName.replace(/ /g, '_');

		return (
			<Link
				href={`player/${fileNameHref}`}
				className="text-2xl text-blue-400 hover:underline active:text-red-400"
			>
				{trimmedFileName}
			</Link>
		);
	};

	return (
		<div
			className="p-16 flex flex-col items-center gap-8"
		>
			<h1
				className="text-4xl font-bold"
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