"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const goToPage = useCallback(
        (page: number) => {
            const sp = new URLSearchParams(searchParams.toString());
            if (page <= 1) {
                sp.delete("page");
            } else {
                sp.set("page", String(page));
            }
            router.push(pathname + (sp.toString() ? `?${sp.toString()}` : ""), { scroll: true });
        },
        [router, pathname, searchParams]
    );

    if (totalPages <= 1) return null;

    // Generate page numbers to show
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="pagination">
            <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Предыдущая"
            >
                <FontAwesomeIcon icon={faChevronLeft} style={{ width: 12, height: 12 }} />
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} style={{ padding: "0 4px", color: "var(--text-muted)" }}>
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        className={`page-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => goToPage(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Следующая"
            >
                <FontAwesomeIcon icon={faChevronRight} style={{ width: 12, height: 12 }} />
            </button>
        </div>
    );
}
