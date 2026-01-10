import React from 'react';
import { Editor, BubbleMenu } from '@tiptap/react';
import {
  Plus,
  Minus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface TableMenuProps {
  editor: Editor;
}

const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'top' }}
      shouldShow={({ editor }) => editor.isActive('table')}
      className="flex items-center gap-1 p-1 bg-popover border border-border rounded-md shadow-md"
    >
      {/* Add row above */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add row above"
        className="p-1 hover:bg-accent rounded text-popover-foreground"
      >
        <div className="flex items-center">
            <ArrowUp className="h-3 w-3" />
            <Plus className="h-3 w-3" />
        </div>
      </button>

      {/* Add row below */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row below"
        className="p-1 hover:bg-accent rounded text-popover-foreground"
      >
        <div className="flex items-center">
            <ArrowDown className="h-3 w-3" />
            <Plus className="h-3 w-3" />
        </div>
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Add column left */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add column left"
        className="p-1 hover:bg-accent rounded text-popover-foreground"
      >
        <div className="flex items-center">
            <ArrowLeft className="h-3 w-3" />
            <Plus className="h-3 w-3" />
        </div>
      </button>

      {/* Add column right */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column right"
        className="p-1 hover:bg-accent rounded text-popover-foreground"
      >
        <div className="flex items-center">
            <ArrowRight className="h-3 w-3" />
            <Plus className="h-3 w-3" />
        </div>
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Delete row */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete row"
        className="p-1 hover:bg-accent rounded text-popover-foreground flex items-center text-xs"
      >
        <Minus className="h-3 w-3 mr-1" />
        Row
      </button>

      {/* Delete column */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete column"
        className="p-1 hover:bg-accent rounded text-popover-foreground flex items-center text-xs"
      >
        <Minus className="h-3 w-3 mr-1" />
        Col
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Delete table */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete table"
        className="p-1 hover:bg-accent rounded text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </BubbleMenu>
  );
};

export default TableMenu;
