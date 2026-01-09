'use client';

import DocumentEditor from '@/components/editor/DocumentEditor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Home() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <DocumentEditor />
        </QueryClientProvider>
    );
}
