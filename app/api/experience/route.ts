import { NextResponse } from 'next/server';

const docId = process.env.RESUME_DOC_ID;
const tabId = process.env.RESUME_TAB_ID;

type ExperienceEntry = {
  title: string;
  company: string;
  period?: string;
  details: string[];
};

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
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

const parseExperienceEntries = (sectionHtml: string): ExperienceEntry[] => {
  const entryRegex = /<p[^>]*>([\s\S]*?)<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/g;
  const entries: ExperienceEntry[] = [];

  let match;
  while ((match = entryRegex.exec(sectionHtml)) !== null) {
    const [, headerHtml, listHtml] = match;

    const headerText = stripTags(headerHtml).trim();
    const parts = headerText.split(/ {2,}/).filter(Boolean);
    const titleCompany = (parts[0] ?? headerText).replace(/ +/g, ' ').trim();
    const period = parts.length > 1 ? parts[parts.length - 1].trim() : undefined;

    const dashIndex = titleCompany.indexOf('–');
    const title =
      dashIndex === -1 ? titleCompany : titleCompany.slice(0, dashIndex).trim();
    const company =
      dashIndex === -1 ? '' : titleCompany.slice(dashIndex + 1).trim();

    const details = Array.from(listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)).map(
      ([, itemHtml]) => stripTags(itemHtml).trim(),
    );

    entries.push({ title, company, period, details });
  }

  return entries;
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
    const section = extractSection(html, 'Experience', ['Education', 'Projects']);
    const experiences = section ? parseExperienceEntries(section) : [];

    return NextResponse.json(experiences, {
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
