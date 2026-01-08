import React from 'react';

interface PageBackgroundProps {
    totalPages: number;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ totalPages }) => {
    // Create an array of length totalPages
    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center gap-4 py-8 z-0">
            {pages.map((pageIndex) => (
                <div
                    key={pageIndex}
                    className="bg-white shadow-md print:shadow-none print:m-0 flex flex-col justify-between relative"
                    style={{
                        width: '816px',
                        height: '1056px',
                    }}
                >
                    {/* Visual Header Area */}
                    <div className="h-24 w-full border-b border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Visual Footer Area */}
                    <div className="h-24 w-full border-t border-gray-50 flex items-end justify-center pb-8 text-xs text-gray-400">
                        Page {pageIndex + 1} of {totalPages}
                    </div>
                </div>
            ))}
        </div>
    );
};
