'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

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

	useResizeObserver(containerRef, {}, onResize);

	const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
		setNumPages(pdf.numPages);
	};

	const handleNextPage = () => {
		if (!numPages) return;
		if (currentPage < numPages) {
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
		if (!containerWidth) return;

		const distance = touchEndX - touchStartX;
		const threshold = containerWidth / 2;

		if (distance < (-1 * threshold)) {
			handleNextPage();
		}

		if (distance > threshold) {
			handlePreviousPage();
		}
	};

	return (
		<div className="min-h-screen w-screen" ref={setContainerRef}>
			<div
				className="h-8 flex items-center justify-center bg-slate-800"
			>
				<button
					className="w-8 bg-slate-600 px-2 mx-2"
					onClick={handlePreviousPage}
				>
					-
				</button>
				<input
					className="w-16 bg-slate-200 text-black px-2"
					onChange={(e) => setCurrentPage(parseInt(e.target.value))}
					type="number"
					value={currentPage}
				/>
				<button
					className="w-8 bg-slate-600 px-2 mx-2 mr-4"
					onClick={handleNextPage}
				>
					+
				</button>
				/ {numPages}
			</div>
			<div
				className="relative"
			>
				<div
					className="absolute top-0 left-0 h-full w-[50vw] cursor-pointer"
					onClick={handlePreviousPage}
					// onTouchStart={handleTouchStart}
					// onTouchMove={handleTouchMove}
					// onTouchEnd={handleTouchEnd}
					style={{ zIndex: 10 }}
				/>
				<div
					className="absolute top-0 right-0 h-full w-[50vw] cursor-pointer"
					onClick={handleNextPage}
					// onTouchStart={handleTouchStart}
					// onTouchMove={handleTouchMove}
					// onTouchEnd={handleTouchEnd}
					style={{ zIndex: 10 }}
				/>
				<Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
					<Page
						pageNumber={currentPage}
						width={containerWidth}
					/>
				</Document>
			</div>
		</div>
	);
};

export default PdfViewer;