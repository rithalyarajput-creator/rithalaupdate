'use client';

import { useState } from 'react';

export type Ruler = {
  key: string;
  modifier: string;
  name: string;
  era: string;
  clan: string;
  image: string | null;
  desc: string;
  fullHistory: {
    born: string;
    died: string;
    reign: string;
    capital: string;
    father: string;
    battles: string[];
    achievements: string[];
    legacy: string;
    story: string;
  };
};

export function RulerCard({ ruler }: { ruler: Ruler }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        className={`rh-ruler-card ${ruler.modifier}`}
        onClick={() => setOpen(true)}
        style={{ cursor: 'pointer' }}
        itemScope
        itemType="https://schema.org/Person"
      >
        {ruler.image ? (
          <img src={ruler.image} alt={ruler.name} className="rh-ruler-img" />
        ) : (
          <div className="rh-ruler-img-placeholder" role="img" aria-label={ruler.name}></div>
        )}
        <div className="rh-ruler-info">
          <span className="rh-ruler-era">{ruler.era} · {ruler.clan}</span>
          <h3 itemProp="name">{ruler.name}</h3>
          <p itemProp="description">{ruler.desc}</p>
          <span className="rh-ruler-read-more">Click to read full history →</span>
        </div>
      </article>

      {open && (
        <div className="rh-modal-overlay" onClick={() => setOpen(false)}>
          <div className="rh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rh-modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

            {ruler.image && (
              <img src={ruler.image} alt={ruler.name} className="rh-modal-img" />
            )}

            <div className="rh-modal-body">
              <span className="rh-modal-clan">{ruler.clan}</span>
              <h2 className="rh-modal-name">{ruler.name}</h2>
              <span className="rh-modal-era">{ruler.era}</span>

              <div className="rh-modal-facts-grid">
                <div className="rh-modal-fact"><span>Born</span><strong>{ruler.fullHistory.born}</strong></div>
                <div className="rh-modal-fact"><span>Died</span><strong>{ruler.fullHistory.died}</strong></div>
                <div className="rh-modal-fact"><span>Reign</span><strong>{ruler.fullHistory.reign}</strong></div>
                <div className="rh-modal-fact"><span>Capital</span><strong>{ruler.fullHistory.capital}</strong></div>
                <div className="rh-modal-fact"><span>Father</span><strong>{ruler.fullHistory.father}</strong></div>
              </div>

              <p className="rh-modal-story">{ruler.fullHistory.story}</p>

              <div className="rh-modal-section">
                <h4>Major Battles</h4>
                <ul>{ruler.fullHistory.battles.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>

              <div className="rh-modal-section">
                <h4>Key Achievements</h4>
                <ul>{ruler.fullHistory.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>

              <div className="rh-modal-section">
                <h4>Legacy</h4>
                <p>{ruler.fullHistory.legacy}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
