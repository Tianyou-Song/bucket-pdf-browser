'use client';

import { useEffect, useState } from 'react';
import { _Object } from '@aws-sdk/client-s3';
import { usePathname } from 'next/navigation';
import PdfViewer from '@/components/pdfViewer';
import { checkIsSessionValid } from '@/app/actions/client-auth';
import { fetchFileUrl } from '@/app/actions/s3-client';
import { useRouter } from 'next/navigation';

const FilePage = ({ params }: { params: { fileName: string; }; }) => {
	const router = useRouter();
	const { fileName } = params;
	const fileResourceName = `${fileName.replace(/_/g, ' ')}.pdf`;

	const pathName = usePathname();
	const segments = pathName.split('/');
	const resourcedName = segments[segments.length - 2];

	const fileKey = `${resourcedName}/${fileResourceName}`;
	const [fileUrl, setFileUrl] = useState<string>();

	useEffect(() => {
		const fetchData = async () => {
			const sessionValid = await checkIsSessionValid();
			if (!sessionValid) {
				router.push('/login');
				return;
			}

			const fileUrl = await fetchFileUrl(fileKey);
			if (!fileUrl) return;
			setFileUrl(fileUrl);
		};
		fetchData();
	}, [fileKey, router]);

	if (!fileUrl) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	};

	return (
		<object
			data={fileUrl}
			type="application/pdf"
			className="min-h-screen w-screen"
		>
			<PdfViewer fileUrl={fileUrl} />
		</object>
	);
};

export default FilePage;
