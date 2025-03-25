"use client";

import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import BarLoader from 'react-spinners/BarLoader';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFViewer = ({ url, className }: {
  url: string;
  className?: string;
}) => {
  const [numPages, setNumPages] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    // Update the container width after the ref is set
    if (containerRef.current) {
      setContainerWidth(containerRef?.current?.offsetWidth);
    }
  }, [containerRef.current]);

  const Loader = () => <div className="w-full min-h-[60svh] flex justify-center items-center">
    <BarLoader
      aria-label="loader"
      data-testid="loader"
      color="#19A873"
    />
  </div>;

  return (
    <div ref={containerRef} className={className}>
      {containerWidth && (
        <Document 
          file={url} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loader />}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1}
              width={containerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<Loader />} />
          ))}
        </Document>
    )}
    </div>
  );
};