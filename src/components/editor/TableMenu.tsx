import React from 'react';
import { Editor } from '@tiptap/react';
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
    <div className="table-menu">
      {/* Add row above */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add row above"
      >
        <ArrowUp className="h-3 w-3" />
        <Plus className="h-3 w-3" />
      </button>

      {/* Add row below */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row below"
      >
        <ArrowDown className="h-3 w-3" />
        <Plus className="h-3 w-3" />
      </button>

      <div className="separator" />

      {/* Add column left */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add column left"
      >
        <ArrowLeft className="h-3 w-3" />
        <Plus className="h-3 w-3" />
      </button>

      {/* Add column right */}
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column right"
      >
        <ArrowRight className="h-3 w-3" />
        <Plus className="h-3 w-3" />
      </button>

      <div className="separator" />

      {/* Delete row */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete row"
      >
        <Minus className="h-3 w-3" />
        Row
      </button>

      {/* Delete column */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete column"
      >
        <Minus className="h-3 w-3" />
        Col
      </button>

      <div className="separator" />

      {/* Delete table */}
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete table"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
};

export default TableMenu;
