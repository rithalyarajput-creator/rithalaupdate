import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import PostCard from '@/components/PostCard';
import { getPublishedPosts } from '@/lib/db';

export const revalidate = 60; // ISR — revalidate every 60s

const galleryCards = [
  { href: '/category/events/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-events-cover.jpg.png', title: 'Events' },
  { href: '/category/places/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-places-cover.jpg.png', title: 'Places' },
  { href: '/category/history/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-temples-cover.jpg.png', title: 'History' },
  { href: '/category/brotherhood/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-brotherhood-cover.jpg.png', title: 'Brotherhood' },
  { href: '/category/kawad-yatra-2024/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-kanwar-yatra-2024-cover.jpg.png', title: 'Kanwar 2024' },
  { href: '/category/kawad-yatra-2025/', img: 'https://rithalaupdate.wordpress.com/wp-content/uploads/2025/09/rithala-village-kanwar-yatra-2025-cover.jpg.png', title: 'Kanwar 2025' },
];

export default async function HomePage() {
  let posts: any[] = [];
  try {
    posts = await getPublishedPosts(6);
  } catch (e) {
    console.error('DB not configured yet:', e);
  }

  return (
    <PublicShell>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <img
              src="https://rithalaupdate.wordpress.com/wp-content/uploads/2025/08/e0a4b8e0a4bee0a4aee0a4bee0a49ce0a4bfe0a495-e0a494e0a4b0-e0a4b8e0a4bee0a482e0a4b8e0a58de0a495e0a583e0a4a4e0a4bfe0a495-e0a4aae0a4b0e0a482e0a4aae0a4b0e0a4bee0a48fe0a481-rithala_village.png"
              alt="Rithala Village"
              width={600}
              height={600}
              style={{ borderRadius: 8, maxWidth: '100%', height: 'auto' }}
            />
            <div className="hero-text">
              <h1>रिठाला गाँव</h1>
              <p>
                रिठाला गाँव दिल्ली के उत्तर-पश्चिम क्षेत्र में स्थित एक प्राचीन और
                ऐतिहासिक गाँव है, जो अपनी राजपूताना विरासत, वीरता और सांस्कृतिक गौरव
                के लिए प्रसिद्ध है।
              </p>
              <Link className="btn" href="/about/">Read More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Categories</h2>
          <div className="cat-cards">
            {galleryCards.map((g) => (
              <Link key={g.href} className="cat-card" href={g.href}>
                <img src={g.img} alt={g.title} loading="lazy" />
                <span>{g.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Latest Posts</h2>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>
              No posts yet. <Link href="/admin/login">Login to admin</Link> to add the first post.
            </p>
          ) : (
            <div className="card-grid">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
