import { useState, useEffect, RefObject } from 'react';

export const PAGE_HEIGHT = 1056; // 11 inches * 96 DPI
export const PAGE_WIDTH = 816; // 8.5 inches * 96 DPI
export const MARGIN = 96; // 1 inch * 96 DPI
export const CONTENT_HEIGHT = PAGE_HEIGHT - (MARGIN * 2);

export function usePagination(contentRef: RefObject<HTMLElement | null>) {
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Measure the height of the actual content inside the editor
                // We use scrollHeight to get the full height even if overflow is hidden (though it shouldn't be)
                // However, TipTap/ProseMirror usually expands the container.
                const height = entry.target.scrollHeight;

                // Calculate pages needed.
                // We assume the text flows continuously. 
                // If height is 0 (empty), at least 1 page.
                if (height === 0) {
                    setTotalPages(1);
                    return;
                }

                // Ideally, we want to know how much "content" height fits on a page.
                // But since we are doing a continuous overlay, we just compare total height against Page Height.
                // To make it look right, we might want to map 1:1 with the visual background.
                // If content > 864px (approx content area), does it go to next page?
                // With continuous flow, yes.
                const pages = Math.ceil(height / PAGE_HEIGHT);
                setTotalPages(Math.max(1, pages));
            }
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [contentRef]);

    return { totalPages };
}
