import { useState, useEffect } from 'react';

export const DocumentTitle = () => {
    const [title, setTitle] = useState('Untitled Document');

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className="flex items-center mb-4 print:hidden">
            <input
                className="text-xl font-semibold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Document Title"
            />
        </div>
    );
};
