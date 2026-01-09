import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { 
  Undo2, 
  Redo2, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  ChevronDown,
  Table,
  Moon,
  Sun,
  FileDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  editor: Editor | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportPDF: () => void;
}

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

const HEADINGS = [
  { label: 'Normal text', value: 'paragraph', level: 0 },
  { label: 'Heading 1', value: 'heading', level: 1 },
  { label: 'Heading 2', value: 'heading', level: 2 },
  { label: 'Heading 3', value: 'heading', level: 3 },
  { label: 'Heading 4', value: 'heading', level: 4 },
  { label: 'Heading 5', value: 'heading', level: 5 },
  { label: 'Heading 6', value: 'heading', level: 6 },
];

const ToolbarButton = ({ 
  onClick, 
  disabled = false, 
  active = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  active?: boolean; 
  children: React.ReactNode; 
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "h-8 w-8 flex items-center justify-center rounded transition-colors",
      "hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed",
      active && "bg-accent"
    )}
  >
    {children}
  </button>
);

const Dropdown = ({
  trigger,
  children,
  open,
  onOpenChange,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="h-8 px-2 flex items-center gap-1 rounded hover:bg-accent transition-colors text-sm"
      >
        {trigger}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] bg-popover border border-border rounded-md shadow-lg py-1">
          {children}
        </div>
      )}
    </div>
  );
};

const EditorToolbar: React.FC<ToolbarProps> = ({ editor, theme, onToggleTheme, onExportPDF }) => {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState('3');
  const [tableCols, setTableCols] = useState('3');

  if (!editor) return null;

  const getCurrentHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) {
        return `Heading ${i}`;
      }
    }
    return 'Normal text';
  };

  const getCurrentFontSize = () => {
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      return attrs.fontSize.replace('pt', '');
    }
    return '12';
  };

  const setHeading = (value: string, level: number) => {
    if (value === 'paragraph') {
      (editor.chain().focus() as any).setParagraph().run();
    } else {
      (editor.chain().focus() as any).toggleHeading({ level }).run();
    }
    setHeadingOpen(false);
  };

  const setFontSize = (size: string) => {
    (editor.chain().focus() as any).setMark('textStyle', { fontSize: `${size}pt` }).run();
    setFontSizeOpen(false);
  };

  const insertTable = () => {
    const rows = parseInt(tableRows) || 3;
    const cols = parseInt(tableCols) || 3;
    (editor.chain().focus() as any).insertTable({ rows, cols, withHeaderRow: true }).run();
    setTableOpen(false);
  };

  return (
    <div className="no-print flex items-center gap-1 px-3 py-2 bg-toolbar border-b border-toolbar-border flex-wrap">
      {/* Theme Toggle - Extreme Left */}
      <ToolbarButton
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).undo().run()}
        disabled={!(editor as any).can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).redo().run()}
        disabled={!(editor as any).can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Heading Dropdown */}
      <Dropdown
        trigger={<span className="min-w-[90px] text-left">{getCurrentHeading()}</span>}
        open={headingOpen}
        onOpenChange={setHeadingOpen}
      >
        {HEADINGS.map((h) => (
          <div
            key={h.label}
            onClick={() => setHeading(h.value, h.level)}
            className={cn(
              "px-3 py-2 text-sm cursor-pointer hover:bg-accent",
              ((h.value === 'paragraph' && editor.isActive('paragraph')) ||
                (h.value === 'heading' && editor.isActive('heading', { level: h.level }))) &&
                "bg-accent font-medium"
            )}
          >
            {h.label}
          </div>
        ))}
      </Dropdown>

      {/* Font Size Dropdown */}
      <Dropdown
        trigger={<span className="min-w-[40px] text-center">{getCurrentFontSize()}</span>}
        open={fontSizeOpen}
        onOpenChange={setFontSizeOpen}
      >
        {FONT_SIZES.map((size) => (
          <div
            key={size}
            onClick={() => setFontSize(size)}
            className={cn(
              "px-3 py-1.5 text-sm cursor-pointer hover:bg-accent",
              getCurrentFontSize() === size && "bg-accent font-medium"
            )}
          >
            {size}
          </div>
        ))}
      </Dropdown>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Formatting Buttons */}
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => (editor.chain().focus() as any).toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists Dropdown */}
      <Dropdown
        trigger={<span className="min-w-[60px] text-left">Lists</span>}
        open={listOpen}
        onOpenChange={setListOpen}
      >
        <div
          onClick={() => {
            (editor.chain().focus() as any).toggleBulletList().run();
            setListOpen(false);
          }}
          className={cn(
            "px-3 py-2 text-sm cursor-pointer hover:bg-accent",
            editor.isActive('bulletList') && "bg-accent font-medium"
          )}
        >
          • Bulleted list
        </div>
        <div
          onClick={() => {
            (editor.chain().focus() as any).toggleOrderedList().run();
            setListOpen(false);
          }}
          className={cn(
            "px-3 py-2 text-sm cursor-pointer hover:bg-accent",
            editor.isActive('orderedList') && "bg-accent font-medium"
          )}
        >
          1. Numbered list
        </div>
      </Dropdown>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Table Insert */}
      <Dropdown
        trigger={
          <>
            <Table className="h-4 w-4" />
            <span className="ml-1">Table</span>
          </>
        }
        open={tableOpen}
        onOpenChange={setTableOpen}
      >
        <div className="p-3">
          <div className="text-sm font-medium mb-2">Insert Table</div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={tableRows}
              onChange={(e) => setTableRows(e.target.value)}
              min="1"
              max="20"
              className="w-14 h-8 px-2 text-sm border border-border rounded bg-background"
              placeholder="Rows"
            />
            <span className="text-sm text-muted-foreground">×</span>
            <input
              type="number"
              value={tableCols}
              onChange={(e) => setTableCols(e.target.value)}
              min="1"
              max="10"
              className="w-14 h-8 px-2 text-sm border border-border rounded bg-background"
              placeholder="Cols"
            />
          </div>
          <button
            type="button"
            onClick={insertTable}
            className="w-full h-8 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Insert
          </button>
        </div>
      </Dropdown>

      <div className="flex-1" />

      {/* Export PDF */}
      <button
        type="button"
        onClick={onExportPDF}
        className="h-8 px-3 flex items-center gap-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
      >
        <FileDown className="h-4 w-4" />
        Export PDF
      </button>
    </div>
  );
};

export default EditorToolbar;
