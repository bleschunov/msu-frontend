import React, { useCallback, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';

function highlightPattern(text: string, pattern: string) {
    console.log(text)
    return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export default function Pdf({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const searchText = "В"

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc =
            `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    })

    const textRenderer = useCallback(
        (textItem: any) => highlightPattern(textItem.str, searchText),
        [searchText]
    );

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page
                    pageNumber={pageNumber}
                    customTextRenderer={textRenderer}
                />
            </Document>
            <div>
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={!!numPages && pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next
                </button>
            </div>
        </>
    );
}