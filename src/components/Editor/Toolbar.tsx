import { Editor } from '@tiptap/react';
import React from 'react';
import clsx from 'clsx';

interface ToolbarProps {
    editor: Editor | null;
}

const ToolbarButton = ({
    onClick,
    isActive,
    children
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode
}) => (
    <button
        onClick={onClick}
        className={clsx(
            "px-3 py-1.5 rounded transition-colors text-sm font-medium",
            isActive
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "text-gray-600 hover:bg-gray-100"
        )}
    >
        {children}
    </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 p-2 bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sticky top-4 z-50 print:hidden">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                Bold
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                Italic
            </ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
            >
                H1
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                H2
            </ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
            >
                Bullet List
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
            >
                Ordered List
            </ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().setMark('textStyle', { fontSize: '20px' }).run()}
                isActive={editor.isActive('textStyle', { fontSize: '20px' })}
            >
                Big
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().unsetMark('textStyle').run()}
            >
                Normal
            </ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <ToolbarButton
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
                Add Table
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
            >
                Del Table
            </ToolbarButton>
        </div>
    );
};
