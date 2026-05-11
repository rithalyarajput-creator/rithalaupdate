import { sql } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import Icon from '@/components/Icon';

export const revalidate = 60;

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  show_on_home: boolean;
  status: string;
};

export const metadata = {
  title: 'Frequently Asked Questions — Rithala Update',
  description: 'Common questions about Rithala Update — submissions, sharing photos, accounts, and more.',
};

export default async function FaqsPage() {
  noStore();
  let faqs: Faq[] = [];
  try {
    const r = await sql<Faq>`
      SELECT * FROM faqs
      WHERE status = 'published'
      ORDER BY display_order ASC, created_at DESC
    `;
    faqs = r.rows;
  } catch {}

  const groups = new Map<string, Faq[]>();
  for (const f of faqs) {
    const k = f.category || 'General';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(f);
  }

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about Rithala Update — submitting photos, accounts, and how the site works.</p>
        </div>
      </section>

      <section className="container faq-body">
        {faqs.length === 0 ? (
          <div className="faq-empty">
            <Icon name="book" size={42} />
            <h3>No FAQs yet</h3>
            <p>Check back soon.</p>
          </div>
        ) : (
          Array.from(groups.entries()).map(([cat, list]) => (
            <div key={cat} className="faq-group">
              <h2 className="faq-group-title">{cat}</h2>
              <div className="faq-list">
                {list.map((f) => (
                  <details key={f.id} className="faq-item">
                    <summary>
                      <span className="faq-q">{f.question}</span>
                      <span className="faq-chev"><Icon name="chevron-down" size={16} /></span>
                    </summary>
                    <div className="faq-a">{f.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
