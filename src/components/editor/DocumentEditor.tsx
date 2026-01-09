import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import EditorToolbar from './EditorToolbar';
import TableMenu from './TableMenu';
import { useTheme } from '@/hooks/useTheme';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Page dimensions at 96 DPI - US Letter
const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;
const PAGE_MARGIN = 96;
const CONTENT_HEIGHT = PAGE_HEIGHT - (2 * PAGE_MARGIN);
const CONTENT_WIDTH = PAGE_WIDTH - (2 * PAGE_MARGIN);
const PAGE_GAP = 40;
const HEADER_HEIGHT = 24;
const FOOTER_HEIGHT = 24;

const DocumentEditor: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [pageCount, setPageCount] = useState(1);
  const [headerText] = useState('');
  const [footerText] = useState('');
  const measureRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
        code: false,
      }),
      Underline,
      TextStyle,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none',
        style: 'font-family: "Times New Roman", Georgia, serif; font-size: 12pt; line-height: 1.6;',
      },
    },
    onUpdate: () => {
      requestAnimationFrame(measureContent);
    },
  });

  const measureContent = useCallback(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      const usableHeight = CONTENT_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;
      const pages = Math.max(1, Math.ceil(height / usableHeight));
      setPageCount(pages);
    }
  }, []);

  useEffect(() => {
    measureContent();
    document.fonts?.ready.then(measureContent);
  }, [measureContent]);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(measureContent);
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [measureContent, editor]);

  // Re-measure when editor content changes
  useEffect(() => {
    if (editor) {
      const updateHandler = () => {
        requestAnimationFrame(measureContent);
      };
      editor.on('update', updateHandler);
      editor.on('selectionUpdate', updateHandler);
      return () => {
        editor.off('update', updateHandler);
        editor.off('selectionUpdate', updateHandler);
      };
    }
  }, [editor, measureContent]);

  const handleExportPDF = useCallback(async () => {
    if (!pagesContainerRef.current || !editor) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [PAGE_WIDTH, PAGE_HEIGHT],
      hotfixes: ['px_scaling'],
    });

    const pages = pagesContainerRef.current.querySelectorAll('.document-page');
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Store original styles
      const originalBg = page.style.background;
      const allElements = page.querySelectorAll('*');
      const originalColors: string[] = [];
      
      // Set print styles
      page.style.background = 'white';
      allElements.forEach((el, idx) => {
        const htmlEl = el as HTMLElement;
        originalColors[idx] = htmlEl.style.color;
        if (htmlEl.classList.contains('tiptap-editor') || 
            htmlEl.closest('.tiptap-editor') ||
            htmlEl.classList.contains('page-number') ||
            htmlEl.classList.contains('document-header') ||
            htmlEl.classList.contains('document-footer')) {
          htmlEl.style.color = '#000000';
        }
      });
      
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      // Restore original styles
      page.style.background = originalBg;
      allElements.forEach((el, idx) => {
        (el as HTMLElement).style.color = originalColors[idx];
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) {
        pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      }
      
      pdf.addImage(imgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    const filename = documentTitle.trim() || 'Untitled document';
    pdf.save(`${filename}.pdf`);
  }, [documentTitle, editor]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus();
    }
  };

  const usableContentHeight = CONTENT_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT;

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

      {/* Table Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ 
            duration: 100,
            placement: 'top',
          }}
          shouldShow={({ editor }) => editor.isActive('table')}
        >
          <TableMenu editor={editor} />
        </BubbleMenu>
      )}

      {/* Pages Container */}
      <div className="flex-1 overflow-auto py-8">
        <div
          ref={pagesContainerRef}
          className="mx-auto"
          style={{ width: `${PAGE_WIDTH}px` }}
        >
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
                  {/* Header */}
                  <div
                    className="document-header absolute left-0 right-0 flex items-center justify-center"
                    style={{
                      top: `${PAGE_MARGIN / 2}px`,
                      height: `${HEADER_HEIGHT}px`,
                      paddingLeft: `${PAGE_MARGIN}px`,
                      paddingRight: `${PAGE_MARGIN}px`,
                    }}
                  >
                    {headerText}
                  </div>

                  {/* Content area with clipping */}
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      top: `${PAGE_MARGIN}px`,
                      left: `${PAGE_MARGIN}px`,
                      width: `${CONTENT_WIDTH}px`,
                      height: `${usableContentHeight}px`,
                    }}
                  >
                    <div
                      ref={pageIndex === 0 ? contentRef : undefined}
                      style={{
                        transform: `translateY(-${pageIndex * usableContentHeight}px)`,
                        width: `${CONTENT_WIDTH}px`,
                      }}
                    >
                      {pageIndex === 0 ? (
                        <div ref={measureRef}>
                          <EditorContent editor={editor} />
                        </div>
                      ) : (
                        <div
                          className="tiptap-editor pointer-events-none select-none"
                          style={{ 
                            fontFamily: '"Times New Roman", Georgia, serif',
                            fontSize: '12pt',
                            lineHeight: 1.6,
                          }}
                          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="document-footer absolute left-0 right-0 flex items-center justify-center"
                    style={{
                      bottom: `${PAGE_MARGIN / 2}px`,
                      height: `${FOOTER_HEIGHT}px`,
                      paddingLeft: `${PAGE_MARGIN}px`,
                      paddingRight: `${PAGE_MARGIN}px`,
                    }}
                  >
                    {footerText}
                  </div>

                  {/* Page number */}
                  <div
                    className="page-number absolute left-0 right-0 text-center"
                    style={{
                      bottom: `${PAGE_MARGIN / 4}px`,
                      fontSize: '10pt',
                      color: 'hsl(var(--muted-foreground))',
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
        <span>US Letter (8.5" × 11") | 1" margins</span>
        <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
      </div>
    </div>
  );
};

export default DocumentEditor;
