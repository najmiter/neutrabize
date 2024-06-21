const quoteQuote = document.getElementById("quote-quote");
const quoteBy = document.getElementById("quote-by");

const fetchedAt = new Date().toLocaleDateString("en-us", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
});

const previousQuote = localStorage.getItem("neutrabize_QUOTE");
if (previousQuote) {
    try {
        const quote = JSON.parse(previousQuote);

        if (quote.fetchedAt !== fetchedAt) {
            fetchNewQuote().then((quote) => updateQuote(quote));
        } else updateQuote(quote);
    } catch {}
} else fetchNewQuote().then((quote) => updateQuote(quote));

async function fetchNewQuote() {
    const jwb = await fetch("https://api.quotable.io/random");

    const quote = await jwb.json();

    localStorage.setItem(
        "neutrabize_QUOTE",
        JSON.stringify({ ...quote, fetchedAt })
    );

    return quote;
}

function updateQuote(quote) {
    quoteQuote.innerHTML = `&ldquo;${quote.content}&rdquo;`;
    quoteBy.innerHTML = `&mdash;&nbsp;${quote.author}`;
}
