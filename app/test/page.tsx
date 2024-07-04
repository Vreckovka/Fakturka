'use client';

import { useCallback, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import './Sample.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Label } from '@/components/ui/label';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

export default function Sample() {
    const [file, setFile] = useState<PDFFile>('./sample.pdf');

    function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { files } = event.target;

        if (files && files[0]) {
            setFile(files[0] || null);
        }
    }

    return (
        <div className="Example">
            <header>
                <h1>react-pdf sample page</h1>
            </header>
            <div className="Example__container">
                <div className="Example__container__load">
                    <Label htmlFor="file">Load from file:</Label>{' '}
                    <input onChange={onFileChange} type="file" />
                </div>
                <div className="Example__container__document" >
                    <Document file={file} options={options}>
                        {Array.from(new Array(1), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={maxWidth}
                            />
                        ))}
                    </Document>
                </div>
            </div>
        </div>
    );
}