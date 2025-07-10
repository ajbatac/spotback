
import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import Image from 'next/image';

// This is a server component, so we can use Node.js modules like `fs` and `path`.
export default async function ChangelogPage() {
  // Find the path to the changelog.md file
  const changelogPath = path.join(process.cwd(), 'changelog.md');
  let content;

  try {
    // Read the file content
    const rawContent = await fs.readFile(changelogPath, 'utf-8');
    // Parse the markdown into HTML
    content = await marked(rawContent);
  } catch (error) {
    console.error("Could not read or parse changelog.md", error);
    content = "<p>Could not load changelog.</p>";
  }
  
  return (
    <main className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4">
                <Image src="/spotify.png" alt="SpotBack Logo" width={50} height={50} />
                <div>
                    <h1 className="text-4xl font-bold font-headline">SpotBack</h1>
                </div>
            </a>
          </div>
        </header>
        
        <div className="bg-card p-6 md:p-10 rounded-lg border">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4">Changelog</h2>
            <div 
              className="prose prose-invert max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
        </div>
    </main>
  );
}

// Add metadata for the page
export const metadata = {
  title: 'Changelog - SpotBack',
  description: 'View the latest changes and updates to the SpotBack application.',
};
