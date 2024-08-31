'use client';

import { useEffect, useState } from 'react';
import { _Object } from '@aws-sdk/client-s3';
import { usePathname } from 'next/navigation';
import { getFileUrl } from '@/app/actions/s3.actions';

const FilePage = ({ params }: { params: { fileName: string; }; }) => {
	const { fileName } = params;
	const fileResourceName = `${fileName.replace(/_/g, ' ')}.pdf`;

	const pathName = usePathname();
	const segments = pathName.split('/');
	const resourcedName = segments[segments.length - 2];

	const fileKey = `${resourcedName}/${fileResourceName}`;
	const [fileUrl, setFileUrl] = useState<string>();

	useEffect(() => {
		const fetchData = async () => {
			const fileUrl = await getFileUrl(fileKey);
			if (!fileUrl) return;
			setFileUrl(fileUrl);
		};
		fetchData();
	}, [fileKey]);

	if (!fileUrl) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	};

	// return (
	// 	<iframe
	// 		src={fileUrl}
	// 		className='h-screen w-screen'
	// 	/>
	// );

	return (
		<embed
			src={fileUrl}
			type="application/pdf"
			className="h-screen w-screen"
		/>
	);
};

export default FilePage;
