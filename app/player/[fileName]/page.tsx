'use client';

import { useEffect, useState } from 'react';
import { _Object } from '@aws-sdk/client-s3';
import { usePathname } from 'next/navigation';
import PDFViewer from '@/utils/pdf-viewer';
import { fetchFileUrl } from '@/app/actions/frontend.actions';

const FilePage = ({ params }: { params: { fileName: string; }; }) => {
	const { fileName } = params;
	// const fileNameDisplay = fileName.replace(/_/g, ' ');
	const fileResourceName = `${fileName.replace(/_/g, ' ')}.pdf`;

	const pathName = usePathname();
	const segments = pathName.split('/');
	const resourcedName = segments[segments.length - 2];

	const fileKey = `${resourcedName}/${fileResourceName}`;
	const [fileUrl, setFileUrl] = useState<string>();

	useEffect(() => {
		const fetchData = async () => {
			const fileUrl = await fetchFileUrl(fileKey);
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

	return (
		<PDFViewer
			fileUrl={fileUrl}
		/>
	);
};

export default FilePage;
