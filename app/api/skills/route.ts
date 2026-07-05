import { NextResponse } from 'next/server';

const docId = process.env.RESUME_DOC_ID;
const tabId = process.env.RESUME_TAB_ID;

type SkillCategory = {
  label: string;
  items: string[];
};

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, ''));

const extractSection = (html: string, heading: string, nextHeadings: string[]) => {
  const headingRegex = new RegExp(
    `<p[^>]*>(?:<span[^>]*>)?${heading}(?:</span>)?</p>`,
    'i',
  );
  const headingMatch = headingRegex.exec(html);
  if (!headingMatch) return null;

  const sectionStart = headingMatch.index + headingMatch[0].length;
  const rest = html.slice(sectionStart);

  let sectionEnd = rest.length;
  for (const next of nextHeadings) {
    const nextRegex = new RegExp(
      `<p[^>]*>(?:<span[^>]*>)?${next}(?:</span>)?</p>`,
      'i',
    );
    const nextMatch = nextRegex.exec(rest);
    if (nextMatch && nextMatch.index < sectionEnd) {
      sectionEnd = nextMatch.index;
    }
  }

  return rest.slice(0, sectionEnd);
};

const parseSkillCategories = (sectionHtml: string): SkillCategory[] => {
  const paragraphs = sectionHtml.match(/<p[^>]*>[\s\S]*?<\/p>/g) ?? [];
  const categories: SkillCategory[] = [];

  for (const paragraph of paragraphs) {
    const text = stripTags(paragraph).trim();
    const colonIndex = text.indexOf(':');
    if (colonIndex === -1) continue;

    const label = text.slice(0, colonIndex).trim();
    const items = text
      .slice(colonIndex + 1)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (label && items.length > 0) {
      categories.push({ label, items });
    }
  }

  return categories;
};

export async function GET() {
  try {
    const response = await fetch(
      `https://docs.google.com/document/d/${docId}/export?format=html&tab=${tabId}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch resume doc (${response.status})`);
    }

    const html = await response.text();
    const section = extractSection(html, 'Skills', ['Experience', 'Education']);
    const categories = section ? parseSkillCategories(section) : [];

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const runtime = 'edge';
