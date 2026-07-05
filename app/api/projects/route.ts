import { NextResponse } from 'next/server';

const docId = process.env.RESUME_DOC_ID;
const tabId = process.env.PROJECTS_TAB_ID;

type Project = {
  name: string;
  title: string | null;
  description: string;
  url: string;
  technologies: string[];
  imageUrl: string | null;
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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const stripBullet = (text = '') => text.replace(/^[-•]\s*/, '').trim();

const parseProjectEntries = (html: string): Project[] => {
  const paragraphs = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g))
    .map(([, inner]) => stripTags(inner).trim())
    .filter(Boolean);

  const entries: Project[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const line = paragraphs[i];
    if (!line.includes('|')) continue;

    const [title, image, url] = line.split('|').map((part) => part.trim());
    if (!title) continue;

    const description = stripBullet(paragraphs[i + 1]);
    const technologiesText = stripBullet(paragraphs[i + 2]);
    const technologies = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    entries.push({
      name: slugify(title),
      title,
      description,
      url: url ?? '',
      technologies,
      imageUrl: image
        ? /^https?:\/\//i.test(image)
          ? image
          : `/projects/${image}`
        : null,
    });

    i += 2;
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
    const projects = parseProjectEntries(html);

    return NextResponse.json(projects, {
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
