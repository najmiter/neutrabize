interface Quote {
  q: string;
  a: string;
  h: string;
}

const quoteQuote = document.getElementById('quote-quote') as HTMLElement;
const quoteBy = document.getElementById('quote-by') as HTMLElement;

try {
  fetchNewQuote()
    .then((quote) => updateQuote(quote))
    .catch(() => {});
} catch {}

async function fetchNewQuote(): Promise<Quote | null> {
  try {
    const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/today/motivational');
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    return null;
  }
}

function updateQuote(quote: Quote | null): void {
  if (!quote) return;
  quoteQuote.innerHTML = `&ldquo;${quote.q}&rdquo;`;
  quoteBy.innerHTML = `&mdash;&nbsp;${quote.a}`;
}
