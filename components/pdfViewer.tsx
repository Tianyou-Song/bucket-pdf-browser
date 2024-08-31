'use client';

import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const options = {
	cMapUrl: '/cmaps/',
	standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
	const [containerHeight, setContainerHeight] = useState<number>();
	const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [numPages, setNumPages] = useState<number>();
	const [touchEndX, setTouchEndX] = useState(0);
	const [touchStartX, setTouchStartX] = useState(0);

	const onResize = useCallback<ResizeObserverCallback>((entries) => {
		const [entry] = entries;

		if (entry) {
			setContainerWidth(entry.contentRect.width);
			setContainerHeight(entry.contentRect.height);
		}
	}, []);

	useResizeObserver(containerRef, resizeObserverOptions, onResize);

	const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
		setNumPages(nextNumPages);
	};

	const handleNextPage = () => {
		if (currentPage < (numPages || 0)) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEndX(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (touchStartX - touchEndX > 50) {
			handleNextPage();
		}

		if (touchStartX - touchEndX < -50) {
			handlePreviousPage();
		}
	};

	return (
		<div className="min-h-screen w-screen" ref={setContainerRef}>
			<div
				className="absolute top-0 left-0 h-full w-[50vw] cursor-pointer"
				onClick={handlePreviousPage}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				style={{ zIndex: 10 }}
			/>
			<div
				className="absolute top-0 right-0 h-full w-[50vw] cursor-pointer"
				onClick={handleNextPage}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				style={{ zIndex: 10 }}
			/>
			<Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} options={options}>
				<Page
					pageNumber={currentPage}
					width={containerWidth}
				/>
			</Document>
		</div>
	);
};

export default PdfViewer;