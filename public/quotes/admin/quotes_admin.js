document.addEventListener("DOMContentLoaded", async () => {
  const allQuotes = JSON.parse(localStorage.getItem("allQuotes"));

  console.log(allQuotes);

  const requestedQ = allQuotes[0];
  const acceptedQ = allQuotes[2];
  const reviewedQ = allQuotes[6];

  const quoteSection = document.getElementById("requested-quotes");
  quoteSection.innerHTML = ""; // Clear existing content

  requestedQ.forEach((quote) => {
    const quoteBox = document.createElement("div");
    quoteBox.className = "quote-box";

    const quoteHeader = document.createElement("h3");
    quoteHeader.textContent = `Quote #${quote.id}`;

    const quoteDescription = document.createElement("p");
    quoteDescription.textContent = `Description: ${quote.comment}`;

    const quoteButton = document.createElement("button");
    quoteButton.className = "button";
    quoteButton.textContent = "Generate Quote";

    quoteButton.onclick = () => generateQuote(quote);

    quoteBox.appendChild(quoteHeader);
    quoteBox.appendChild(quoteDescription);
    quoteBox.appendChild(quoteButton);

    quoteSection.appendChild(quoteBox);
  });
});

function generateQuote(quote) {
  localStorage.setItem("passedVar", JSON.stringify(quote));
  window.location.href = "/generate quote/GenerateQuote(Admin).html";
}
