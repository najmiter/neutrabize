interface Quote {
  content: string;
  author: string;
  fetchedAt?: string;
}

const quoteQuote = document.getElementById('quote-quote') as HTMLElement;
const quoteBy = document.getElementById('quote-by') as HTMLElement;

const fetchedAt = new Date().toLocaleDateString('en-us', {
  day: 'numeric',
  month: 'numeric',
  year: '2-digit',
});

const previousQuote = localStorage.getItem('neutrabize_QUOTE');
if (previousQuote) {
  try {
    const quote: Quote = JSON.parse(previousQuote);

    if (quote.fetchedAt !== fetchedAt) {
      fetchNewQuote()
        .then((quote) => updateQuote(quote))
        .catch(() => updateQuote(quote));
    } else updateQuote(quote);
  } catch {}
} else {
  fetchNewQuote()
    .then((quote) => updateQuote(quote))
    .catch(() => {});
}

async function fetchNewQuote(): Promise<Quote> {
  while (true) {
    const jwb = await fetch('https://api.quotable.io/random');
    const quote: Quote = await jwb.json();

    if (quote.content.length > 75) continue;

    localStorage.setItem(
      'neutrabize_QUOTE',
      JSON.stringify({ ...quote, fetchedAt })
    );
    return quote;
  }
}

function updateQuote(quote: Quote): void {
  quoteQuote.innerHTML = `&ldquo;${quote.content}&rdquo;`;
  quoteBy.innerHTML = `&mdash;&nbsp;${quote.author}`;
}
