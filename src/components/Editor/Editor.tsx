"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import React, { useRef } from 'react';
import { Toolbar } from './Toolbar';
import { PageBackground } from './PageBackground';
import { usePagination } from '@/lib/usePagination';
import { DocumentTitle } from './DocumentTitle';

export default function Editor() {
    const editorContentRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
        ],
        content: ``,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none w-full h-full',
                style: 'min-height: 864px; padding: 96px;', // 1 inch padding
            },
        },
        onUpdate: () => {
            // Trigger pagination re-calc if needed 
        }
    });

    // Calculate pages
    const { totalPages } = usePagination(editorContentRef);

    return (
        <div className="flex flex-col items-center relative w-full pointer-events-auto print:block print:w-full">

            <div className="w-full max-w-5xl flex justify-between items-end mb-2 screen-only">
                <DocumentTitle />
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-medium text-sm"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <Toolbar editor={editor} />

            {/* Editor Container - visually mimics the page stack */}
            <div className="relative print:w-full print:h-full">

                {/* Visual Background Pages (Screen Only) */}
                <div className="print:hidden">
                    <PageBackground totalPages={totalPages} />
                </div>

                {/* The Editor Content Overlay */}
                {/* We fix the width to match the page width so text wraps correctly. */}
                <div
                    ref={editorContentRef}
                    className="relative z-10 print:w-full"
                    style={{ width: '816px' }}
                >
                    <EditorContent editor={editor} />
                </div>

            </div>

            {/* Print Footer for "Page X" - standard browser headers usually handle this, 
                 but we can add a custom footer if needed. 
                 For now, we rely on browser + the global.css fixed footer
             */}
            <div className="print-footer print:flex hidden">
                <span className="font-semibold mr-2">Doc Editor</span> - Generated Document
            </div>

            {/* Print-specific style adjustments */}
            <style jsx global>{`
        /* 
         * Ensure content flows for print. 
         * The browser will naturally break pages.
         * We just need to ensure margins are respected.
         */
        @media print {
            .ProseMirror {
                padding: 96px !important; /* 1 inch margin on paper */
                width: 100%;
            }
            .screen-only {
                display: none !important;
            }
        }
      `}</style>
        </div>
    );
}
