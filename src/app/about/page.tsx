import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import Icon from '@/components/Icon';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us — Rithala Update | Story, Mission & Vision',
  description: 'About Rithala Update — a digital platform created by Sandeep Rajput (Rithalya Rajput) to share the latest news, history, culture, festivals and updates of Rithala Village, Delhi. Officially launched on 15 August 2022.',
  keywords: 'About Rithala Update, Rithala Village Delhi, Sandeep Rajput, Rithalya Rajput, Rithala history, digital village platform',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: 'About Rithala Update — Sandeep Rajput',
    description: 'Digital platform for Rithala Village, Delhi. Sharing news, history, culture, festivals and community updates since 15 August 2022.',
    url: '/about/',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="about-hero">
        <div className="container">
          <span className="about-eyebrow">About Us</span>
          <h1 className="about-h1">About Rithala Update</h1>
          <p className="about-sub">
            A digital platform preserving the identity, culture and heritage of
            Rithala Village, Delhi — created by <strong>Sandeep Rajput</strong> (Rithalya Rajput).
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-prose">
          <p>
            Rithala Update is a dedicated digital platform created to share the latest news,
            cultural activities, historical stories, village updates, and important information
            related to Rithala Village, Delhi. Officially launched on <strong>15 August 2022</strong>,
            Rithala Update was started with a simple but powerful vision — to digitally connect
            the people of Rithala and preserve the identity, culture, and heritage of the
            village for future generations.
          </p>

          <p>
            In today's fast-moving digital world, local communities and their stories often get
            ignored. Rithala Update was created to ensure that the traditions, history,
            festivals, achievements, and daily life of Rithala Village continue to reach people
            through modern digital platforms. What started as a small social media initiative
            gradually became one of the growing local digital platforms representing Rithala online.
          </p>

          <p>
            Before the website was launched, updates related to Rithala Village were regularly
            shared on Instagram, Facebook, and other social media platforms. As more people
            started connecting with the content, the need for a dedicated website became clear.
            To organize local stories, event coverage, historical memories, photographs, and
            village updates in one place, the official Rithala Update website was launched on
            15 August 2022 — a date chosen to symbolize awareness, freedom of information, and
            community connection.
          </p>

          <h2>Created by Sandeep Rajput</h2>
          <p>
            Rithala Update was created and is managed by <Link href="/sandeep-rajput/"><strong>Sandeep Rajput</strong></Link>,
            popularly known online as <strong>Rithalya Rajput</strong>. A resident of Rithala Village, Delhi,
            Sandeep is passionate about creativity, technology, digital media, and preserving local
            culture through online platforms. From website development and content creation to
            social media management and event coverage, the entire platform has been independently
            designed and maintained with dedication and passion.
          </p>

          <h2>Our Purpose</h2>
          <p>
            The main purpose behind creating Rithala Update was to socially connect the people
            of Rithala, spread awareness, and give the village a strong digital identity. Through
            regular posts, videos, photographs, and news updates, the platform helps residents
            stay informed about local events, festivals, government developments, cultural
            activities, and social matters affecting the community.
          </p>

          <h2>What We Cover</h2>
          <p>
            At Rithala Update, we cover a wide range of topics including local news, village
            history, Rajput heritage, cultural events, religious programs, social activities,
            infrastructure developments, old memories, and community stories. We also share
            photo galleries, video highlights, and updates related to important celebrations
            such as Janmashtami, Independence Day, cultural programs, and other local events
            that reflect the spirit of Rithala Village.
          </p>

          <h2>Preserving Our Heritage</h2>
          <p>
            One of the biggest goals of Rithala Update is to preserve the heritage and cultural
            identity of Rithala Village in the digital era. We believe that every village has
            its own story, traditions, and legacy, and those stories deserve to be documented
            and shared with future generations. Through this platform, we aim to build awareness,
            unity, and pride within the community while also introducing the culture and history
            of Rithala to a wider audience.
          </p>

          <p>
            Today, Rithala Update is more than just a website or social media page — it is a
            growing digital community platform that represents the voice, identity, and culture
            of Rithala Village. With continuous support from the community and the vision to
            keep improving, Rithala Update will continue working towards preserving the village's
            heritage while keeping people updated with the present and future of Rithala.
          </p>

          <div className="about-cta-row">
            <Link href="/sandeep-rajput/" className="about-btn-primary">
              <Icon name="user" size={14} /> Meet the Founder
            </Link>
            <Link href="/contact/" className="about-btn-ghost">
              <Icon name="mail" size={14} /> Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
