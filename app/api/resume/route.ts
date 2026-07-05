const docId = process.env.RESUME_DOC_ID;
const tabId = process.env.RESUME_TAB_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://docs.google.com/document/d/${docId}/export?format=pdf&tab=${tabId}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch resume PDF (${response.status})`);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'inline; filename="Julienne-Andrea-Panes-Resume.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}

export const runtime = 'edge';
