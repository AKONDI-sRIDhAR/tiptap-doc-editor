import Link from "next/link";
import Editor from "@/components/Editor/Editor";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-8">
      <Editor />
    </main>
  );
}
