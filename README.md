# Document Editor

A rich-text document editor built with **Next.js 15**, **Tailwind CSS**, and **Tiptap**.

This project provides a "Word-like" writing experience with print-accurate pagination and export capabilities.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/doc-editor.git
    cd doc-editor
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Approach: Pagination & Page Breaks

One of the core challenges in a browser-based editor is ensuring that what you see on the screen matches exactly what comes out of the printer (WYSIWYG).

### How It Works

Instead of treating the editor as one long scrollable text area (like a standard webpage), we enforce a "page-based" layout using CSS and specific dimensions.

1.  **CSS Dimensions**: We define a page container with fixed dimensions matching standard US Letter paper (`8.5in` x `11in`), including localized padding for margins.
2.  **Visual Separation**: The editor renders these pages as distinct cards with shadows, mimicking a physical desk view.
3.  **Content Flow**: While the current implementation relies on Tiptap's document model, visual pagination acts as a strict guide. We style the editor container to behave like a series of pages.
4.  **Print Styles**: We use a dedicated `@media print` stylesheet that strips away the UI (toolbars, shadows, background colors) and sets the page size to `letter`, ensuring the browser's print driver respects our breakpoints.

### Trade-offs & Limitations

-   **Browser Rendering Differences**: While we force dimensions, font rendering (kerning, line height) can vary slightly between Chrome, Firefox, and Safari. This might cause a line of text to wrap on one browser but not another.
-   **Client-Side Heavy**: The pagination logic is primarily visual. True "content-aware" splitting (automatically moving a paragraph to the next page if it crosses a boundary) is ensuring by visual cues rather than a strict physics engine, meaning users sometimes have to manually adjust breaks.
-   **Performance**: Rendering very long documents (100+ pages) as a single DOM tree can be memory-intensive.

### Future Improvements

If I had more time to dedicate to this project, here is what I would tackle next:

-   **Virtualization**: Implementing a virtual scroller to only render the pages currently in the viewport. This would drastically improve performance for long documents.
-   **Server-Side PDF Generation**: Currently, we rely on client-side export. Moving this to a Node.js service (using Puppeteer or Playwright) would generate byte-perfect PDFs identical to the print view, effectively solving cross-browser rendering quirks.
-   **Collaborative Editing**: Integrating Tiptap's collaboration (Y.js) to support real-time multiplayer editing using WebSockets.
