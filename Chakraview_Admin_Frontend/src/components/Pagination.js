"use client";
import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
    // const renderPagination = () => {
    //     const pageButtons = [];
    //     const showPages = new Set();

    //     // Always show first 2 pages
    //     showPages.add(1);
    //     if (totalPages >= 2) showPages.add(2);

    //     // Current page and its neighbors
    //     if (page > 2 && page < totalPages - 1) {
    //         showPages.add(page - 1);
    //         showPages.add(page);
    //         showPages.add(page + 1);
    //     }

    //     // Always show last page
    //     if (totalPages > 3) showPages.add(totalPages);

    //     const sortedPages = Array.from(showPages).sort((a, b) => a - b);

    //     sortedPages.forEach((p, idx) => {
    //         if (idx > 0 && p - sortedPages[idx - 1] > 1) {
    //             pageButtons.push(
    //                 <li key={`ellipsis-${idx}`} className="page-item disabled">
    //                     <span className="page-link">...</span>
    //                 </li>
    //             );
    //         }

    //         pageButtons.push(
    //             <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
    //                 <button className="page-link" onClick={() => onPageChange(p)}>
    //                     {p}
    //                 </button>
    //             </li>
    //         );
    //     });

    //     return pageButtons;
    // };

    const renderPagination = () => {
        const pageButtons = [];
        const showPages = new Set();

        // Always show first 3 pages
        showPages.add(1);
        if (totalPages >= 2) showPages.add(2);
        if (totalPages >= 3) showPages.add(3);

        // Show current page -1, current, current +1 (if in range)
        if (page > 3 && page < totalPages - 2) {
            showPages.add(page - 1);
            showPages.add(page);
            showPages.add(page + 1);
        }

        // Always show last 2 pages
        if (totalPages > 4) showPages.add(totalPages);
        if (totalPages > 5) showPages.add(totalPages - 1);

        const sortedPages = Array.from(showPages).sort((a, b) => a - b);

        sortedPages.forEach((p, idx) => {
            // If gap between current and previous page is more than 1, insert ellipsis
            if (idx > 0 && p - sortedPages[idx - 1] > 1) {
                pageButtons.push(
                    <li key={`ellipsis-${idx}`} className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            pageButtons.push(
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(p)}>
                        {p}
                    </button>
                </li>
            );
        });

        return pageButtons;
    };


    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-end">
                {/* Previous Button */}
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(page - 1)}><i className="fa-solid fa-angles-left"></i></button>
                    {/* <button className="page-link" onClick={() => onPageChange(page - 1)}>Previous</button> */}
                </li>

                {renderPagination()}

                {/* Next Button */}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => onPageChange(page + 1)}><i className="fa-solid fa-angles-right"></i></button>
                    {/* <button className="page-link" onClick={() => onPageChange(page + 1)}>Next</button> */}
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
