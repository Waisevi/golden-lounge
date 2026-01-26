import { getAssetUrl } from "./assets";

export type NewsArticle = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
};

export const newsArticles: NewsArticle[] = [
  {
    title: "Maximizing VIP Experiences: A Guide to Miami's Nightlife",
    slug: "miami-nightlife-vip-experience-guide",
    date: "January 20, 2026",
    excerpt: "Discover how to make the most of your night out in Downtown Miami with our exclusive VIP tips.",
    content: `
      <p>Downtown Miami's nightlife is legendary, but navigating it can be a challenge. To truly experience the city's energy, a VIP approach is essential.</p>
      <h2>What Makes a VIP Experience?</h2>
      <p>It's not just about the table; it's about the service, the atmosphere, and the seamless transition from arrival to departure.</p>
      <h3>Priority Access</h3>
      <p>Skip the lines and head straight to the action. Our VIP list ensures you spend your time where it matters.</p>
      <p>Stay tuned for more updates on our upcoming exclusive events.</p>
    `,
    image: getAssetUrl("/images/events/friday-vibes.webp"),
    author: "Elena Rodriguez",
    category: "Nightlife",
  },
  {
    title: "The Art of the Craft Cocktail: Winter 2026 Edition",
    slug: "art-of-craft-cocktails-winter-2026",
    date: "January 15, 2026",
    excerpt: "Our lead mixologist shares the secrets behind our new seasonal menu.",
    content: `
      <p>This winter, we're focusing on bold flavors and unexpected pairings. From smoked rosemary to house-made infusions, every drink tells a story.</p>
      <h2>Top 3 Winter Cocktails</h2>
      <ul>
        <li><strong>The Midnight Ember:</strong> A smoky blend of mezcal and blood orange.</li>
        <li><strong>Winter Velvet:</strong> Smooth bourbon with hints of vanilla and spice.</li>
        <li><strong>Neon Sunset:</strong> A refreshing twist on the classic gin fizz.</li>
      </ul>
      <p>Visit us this weekend to try them all.</p>
    `,
    image: getAssetUrl("/images/events/latin-heat.webp"),
    author: "Marco Rossi",
    category: "Cocktails",
  },
  {
    title: "Rooftop Sessions Return to Miami Skyline",
    slug: "rooftop-sessions-return",
    date: "January 10, 2026",
    excerpt: "The popular Sunset Sessions are back with a fresh lineup of live acoustic performers.",
    content: `
      <p>There's nothing quite like watching the sun go down over Biscayne Bay with live music in the background. Our Rooftop Sessions are back and better than ever.</p>
      <h2>Live Music Schedule</h2>
      <p>Every Sunday starting from 6 PM. Join us for a relaxed evening with stunning views.</p>
    `,
    image: getAssetUrl("/images/events/sunset-sessions.webp"),
    author: "Julian Chen",
    category: "Events",
  },
];
