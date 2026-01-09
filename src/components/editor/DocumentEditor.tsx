import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import History from '@tiptap/extension-history';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HardBreak from '@tiptap/extension-hard-break';
import TextStyle from '@tiptap/extension-text-style';
import Gapcursor from '@tiptap/extension-gapcursor';
import EditorToolbar from './EditorToolbar';
import { useTheme } from '@/hooks/useTheme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Page dimensions at 96 DPI
const PAGE_WIDTH = 816; // 8.5 inches
const PAGE_HEIGHT = 1056; // 11 inches
const PAGE_MARGIN = 96; // 1 inch
const CONTENT_HEIGHT = PAGE_HEIGHT - (2 * PAGE_MARGIN);
const CONTENT_WIDTH = PAGE_WIDTH - (2 * PAGE_MARGIN);
const PAGE_GAP = 40;

const DocumentEditor: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [pageCount, setPageCount] = useState(1);
  const measureRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
      History,
      HardBreak,
      TextStyle,
      Gapcursor,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none min-h-[200px]',
        style: 'font-family: "Times New Roman", Georgia, serif; font-size: 12pt; line-height: 1.5;',
      },
    },
    onUpdate: () => {
      requestAnimationFrame(measureContent);
    },
  });

  const measureContent = useCallback(() => {
    if (measureRef.current) {
      const height = measureRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(height / CONTENT_HEIGHT));
      setPageCount(pages);
    }
  }, []);

  useEffect(() => {
    measureContent();
    if (typeof document !== 'undefined') {
      document.fonts?.ready.then(measureContent);
    }
  }, [measureContent]);

  useEffect(() => {
    if (measureRef.current) {
      const resizeObserver = new ResizeObserver(measureContent);
      resizeObserver.observe(measureRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [measureContent]);

  const handleExportPDF = useCallback(async () => {
    if (!pagesContainerRef.current) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [PAGE_WIDTH, PAGE_HEIGHT],
    });

    const pages = pagesContainerRef.current.querySelectorAll('.document-page');
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Temporarily set white background for PDF
      const originalBg = page.style.background;
      page.style.background = 'white';
      
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      page.style.background = originalBg;
      
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) {
        pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      }
      
      pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    const filename = documentTitle.trim() || 'Untitled document';
    pdf.save(`${filename}.pdf`);
  }, [documentTitle]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-workspace">
      {/* Header with title */}
      <div className="no-print flex items-center px-4 py-3 bg-toolbar border-b border-toolbar-border">
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled document"
          className="text-lg font-medium bg-transparent border-none outline-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          style={{ minWidth: '200px' }}
        />
      </div>

      {/* Toolbar */}
      <EditorToolbar
        editor={editor}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExportPDF={handleExportPDF}
      />

      {/* Pages Container */}
      <div className="flex-1 overflow-auto py-8">
        <div
          ref={pagesContainerRef}
          className="mx-auto"
          style={{ width: `${PAGE_WIDTH}px` }}
        >
          {/* Render pages */}
          {Array.from({ length: pageCount }, (_, pageIndex) => {
            const isLastPage = pageIndex === pageCount - 1;

            return (
              <React.Fragment key={pageIndex}>
                <div
                  className="document-page relative"
                  style={{
                    width: `${PAGE_WIDTH}px`,
                    minHeight: `${PAGE_HEIGHT}px`,
                    marginBottom: isLastPage ? 0 : `${PAGE_GAP}px`,
                  }}
                >
                  {/* Content area with clipping */}
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      top: `${PAGE_MARGIN}px`,
                      left: `${PAGE_MARGIN}px`,
                      width: `${CONTENT_WIDTH}px`,
                      height: `${CONTENT_HEIGHT}px`,
                    }}
                  >
                    <div
                      ref={pageIndex === 0 ? measureRef : undefined}
                      style={{
                        transform: `translateY(-${pageIndex * CONTENT_HEIGHT}px)`,
                        width: `${CONTENT_WIDTH}px`,
                      }}
                    >
                      {pageIndex === 0 ? (
                        <EditorContent editor={editor} />
                      ) : (
                        <div
                          className="tiptap-editor pointer-events-none select-none"
                          style={{ 
                            fontFamily: '"Times New Roman", Georgia, serif',
                            fontSize: '12pt',
                            lineHeight: 1.5,
                          }}
                          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Page number */}
                  <div
                    className="absolute left-0 right-0 text-center text-sm no-print"
                    style={{
                      bottom: `${PAGE_MARGIN / 2 - 8}px`,
                      color: '#666',
                    }}
                  >
                    {pageIndex + 1}
                  </div>
                </div>

                {/* Page break indicator */}
                {!isLastPage && (
                  <div
                    className="flex items-center justify-center no-print"
                    style={{
                      height: `${PAGE_GAP}px`,
                      marginTop: `-${PAGE_GAP}px`,
                      marginBottom: `${PAGE_GAP}px`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-16 border-t border-dashed border-muted-foreground/50" />
                      <span className="text-xs text-muted-foreground px-2 py-0.5 bg-workspace rounded">
                        Page break
                      </span>
                      <div className="w-16 border-t border-dashed border-muted-foreground/50" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="no-print flex items-center justify-between px-4 py-1.5 bg-toolbar border-t border-toolbar-border text-xs text-muted-foreground">
        <span>US Letter • 8.5" × 11" • 1" margins</span>
        <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
      </div>
    </div>
  );
};

export default DocumentEditor;
