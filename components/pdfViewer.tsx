'use client';

import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// 	'pdfjs-dist/build/pdf.worker.min.mjs',
// 	import.meta.url,
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const options = {
	cMapUrl: '/cmaps/',
	standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
	const [numPages, setNumPages] = useState<number>();
	const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>();

	const onResize = useCallback<ResizeObserverCallback>((entries) => {
		const [entry] = entries;

		if (entry) {
			setContainerWidth(entry.contentRect.width);
		}
	}, []);

	useResizeObserver(containerRef, resizeObserverOptions, onResize);

	const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
		setNumPages(nextNumPages);
	};

	return (
		<div className="min-h-screen w-screen" ref={setContainerRef}>
			<Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} options={options}>
				{Array.from(new Array(numPages), (_el, index) => (
					<Page
						key={`page_${index + 1}`}
						pageNumber={index + 1}
						width={containerWidth}
					/>
				))}
			</Document>
		</div>
	);
};

export default PdfViewer;