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
                    className="bg-white shadow-md print:shadow-none print:m-0"
                    style={{
                        width: '816px',
                        height: '1056px',
                        // No margin/padding here, handled by the Editor container's internal padding mostly,
                        // but effectively this is the "Paper".
                        // Implementation note: The gap-4 in parent creates the visual separation.
                    }}
                />
            ))}
        </div>
    );
};
