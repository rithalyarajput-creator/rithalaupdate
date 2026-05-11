import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';
import { getAllSettings } from '@/lib/db';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us — Rithala Update | Our story and mission',
  description: 'About Rithala Update — a digital archive of Rithala village heritage, Rajputana culture, and timeless traditions.',
  alternates: { canonical: '/about/' },
};

export default async function AboutPage() {
  const settings: Record<string, string> = await getAllSettings().catch(() => ({}));
  return (
    <PublicShell>
      <section className="ab-hero">
        <div className="container">
          <span className="ab-eyebrow">About Us</span>
          <h1 className="ab-h1">Rithala Update</h1>
          <p className="ab-lead">
            A digital archive of <strong>रिठाला गाँव</strong> — preserving 640+ years of
            Rajputana heritage, sacred temples, and the cultural memory of our village.
          </p>
        </div>
      </section>

      <section className="ab-section">
        <div className="container ab-prose">
          <h2>हमारी कहानी</h2>
          <p>
            रिठाला गाँव, दिल्ली के उत्तर-पश्चिम क्षेत्र का एक प्राचीन ऐतिहासिक गाँव है,
            जिसकी स्थापना 1384-85 ईस्वी में राणा राजपाल सिंह ने की थी। यह गाँव
            तोमर चंद्रवंशी राजपूतों की भूमि है, जो अपनी वीरता, परंपराओं और सांस्कृतिक
            गौरव के लिए प्रसिद्ध है।
          </p>
          <p>
            <strong>Rithala Update</strong> इस गाँव की कहानियाँ, photos, events और
            ऐतिहासिक यादों को digital रूप में संजोने का प्रयास है। हम चाहते हैं कि
            आने वाली पीढ़ियाँ अपने गाँव के इतिहास से जुड़ी रहें और राजपूताना विरासत
            पर गर्व महसूस करें।
          </p>

          <h2>Our Mission</h2>
          <ul className="ab-list">
            <li><Icon name="book" size={16} /> Preserve the history and stories of Rithala village for future generations</li>
            <li><Icon name="photo" size={16} /> Document temples, places, festivals through photos and video reels</li>
            <li><Icon name="users" size={16} /> Build a community of Rithala people scattered across the world</li>
            <li><Icon name="flag" size={16} /> Celebrate Rajputana heritage and cultural identity</li>
          </ul>

          <h2>क्या आप भी हिस्सा बनना चाहते हैं?</h2>
          <p>
            अगर आपके पास रिठाला से जुड़ी कोई पुरानी photo, story, या यादगार moment है,
            तो हमें ज़रूर भेजें। आपकी हर कहानी इस archive का हिस्सा बनेगी।
          </p>

          <div className="ab-cta-row">
            <Link href="/contact/" className="ab-btn-primary">
              <Icon name="mail" size={14} /> Share Your Story
            </Link>
            <Link href="/sandeep-rajput/" className="ab-btn-ghost">
              Meet the Founder
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
