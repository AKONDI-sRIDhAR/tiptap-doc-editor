import Link from "next/link";
import Editor from "@/components/Editor/Editor";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-5xl px-4 flex justify-between items-center mb-6 screen-only">
        <h1 className="text-xl font-semibold text-gray-700">Untitled Document</h1>
        <div className="text-sm text-gray-500">
          Simple Tiptap Pagination
        </div>
      </div>

      <Editor />
    </main>
  );
}
