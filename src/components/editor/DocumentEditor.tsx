'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { PaginationPlus } from 'tiptap-pagination-plus';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

import EditorToolbar from './EditorToolbar';
import TableMenu from './TableMenu';
import { FontSize } from './extensions';

export default function DocumentEditor() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontSize,
            TextAlign.configure({
                types: ['paragraph', 'heading'],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            PaginationPlus.configure({
                pageHeight: 1056,
                pageWidth: 816,
            }),
        ],
        content: ``,
        editorProps: {
            attributes: {
                class: 'outline-none h-full p-8',
                style: 'min-height: 1056px;'
            },
        },
        immediatelyRender: false,
    });

    const handleExportPDF = () => {
        if (!editor) return;
        window.print();
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    if (!editor) {
        return null; // Or a loading spinner
    }

    return (
        <div className={cn("flex flex-col h-screen w-full bg-background transition-colors duration-200", theme)}>
            <div className="flex flex-col h-full bg-[var(--workspace-bg)]">
                <EditorToolbar
                    editor={editor}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    onExportPDF={handleExportPDF}
                />

                <div className="flex-1 overflow-auto p-8 flex justify-center">
                    <div className="relative">
                        <EditorContent
                            editor={editor}
                            className={cn(
                                "min-h-[1056px] w-[816px] bg-[hsl(var(--page-bg))] border border-[hsl(var(--page-border))] shadow-[0_4px_6px_-1px_hsl(var(--page-shadow))] text-[hsl(var(--editor-text))]",
                                "transition-colors duration-200"
                            )}
                        />
                        <TableMenu editor={editor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
