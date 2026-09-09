interface Quote {
  q: string;
  a: string;
  h?: string;
}

interface CachedQuote {
  at: number;
  quote: Quote;
}

const QUOTE_KEY = 'neutrabize_QUOTE';
const MAX_AGE = 1000 * 60 * 60 * 12;

const quoteQuote = document.getElementById('quote-quote') as HTMLElement;
const quoteBy = document.getElementById('quote-by') as HTMLElement;

const cached = readCache();
if (cached) updateQuote(cached.quote);

if (localStorage.getItem('neutrabize_SHOULDSHOWQUOTE') === 'true' && (!cached || Date.now() > cached.at + MAX_AGE)) {
  fetchNewQuote()
    .then((quote) => {
      if (!quote) return;
      updateQuote(quote);
      localStorage.setItem(QUOTE_KEY, JSON.stringify({ at: Date.now(), quote } satisfies CachedQuote));
    })
    .catch(() => {});
}

function readCache(): CachedQuote | null {
  const raw = localStorage.getItem(QUOTE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedQuote;
    return parsed?.quote?.q ? parsed : null;
  } catch {
    localStorage.removeItem(QUOTE_KEY);
    return null;
  }
}

async function fetchNewQuote(): Promise<Quote | null> {
  try {
    const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/today/motivational', {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const quote = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return quote?.q && quote?.a ? quote : null;
  } catch {
    return null;
  }
}

function updateQuote(quote: Quote): void {
  quoteQuote.textContent = `“${quote.q}”`;
  quoteBy.textContent = `— ${quote.a}`;
}
