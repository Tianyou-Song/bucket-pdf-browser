import React from 'react';

const PdfViewer = ({ fileUrl }: { fileUrl: string; }) => {
	return (
		<iframe
			src={fileUrl}
			style={{
				height: '100vh',
				width: '100vw',
			}}
		/>
	);
};

export default PdfViewer;