"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useRef } from 'react';
import { Toolbar } from './Toolbar';
import { PageBackground } from './PageBackground';
import { usePagination } from '@/lib/usePagination';

import Placeholder from '@tiptap/extension-placeholder';

export default function Editor() {
    const editorContentRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
        ],
        content: ``,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none w-full h-full',
                style: 'min-height: 864px; padding: 96px;',
            },
        },
        onUpdate: () => {
            // Trigger pagination re-calc if needed (ResizeObserver handles strictly layout changes, 
            // but content updates might change height without triggering resize immediately in some edge cases? 
            // ResizeObserver is safer).
        }
    });

    // Calculate pages
    // We attach the ref to the specific content div usually, 
    // but TipTap's EditorContent wraps it.
    // We'll wrap EditorContent in a div we can measure.
    const { totalPages } = usePagination(editorContentRef);

    return (
        <div className="flex flex-col items-center relative w-full pointer-events-auto print:block print:w-full">
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
        }
      `}</style>
        </div>
    );
}
