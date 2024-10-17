import updateHomeLink from "/utilities/homeLink.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import createNavBar from "/utilities/navbar.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

document.addEventListener("DOMContentLoaded", () => {
  const titles = [
    "Home",
    "Employees",
    "Services",
    "Quotes",
    "Generate report",
    "My Profile",
  ];
  const links = [
    "/admin home/Home(Admin).html",
    "/current employees/current_employees.html",
    "/services admin/ServicesAdmin.html",
    "/quotes/admin/Quotes(Admin).html",
    "/reports/Reports.html",
    "/profile/Profile.html",
  ];

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  let lc = new LoadingScreen(document);
  lc.show();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let allQuotes = await QuoteDA.instance.getAllQuotesForUser({
    user: loggedInUser,
  });
  console.log(allQuotes);

  lc.updateText("Organising your quotes...");

  const requestedQ = allQuotes.get(Quote.sStatusRequested);
  const acceptedQ = allQuotes.get(Quote.sStatusAccepted);
  const reviewedQ = allQuotes.get(Quote.sStatusReviewed);

  const requestedQuotesSection = document.getElementById("requested-quotes");

  const quoteButton = document.createElement("button");
  quoteButton.className = "button";
  quoteButton.textContent = "Generate Quote";
  quoteButton.onclick = (quote) => generateQuote(quote);

  createQuoteBox({
    topDiv: requestedQuotesSection,
    quoteMap: requestedQ,
    clearTopDiv: true,
    buttonList: [quoteButton],
  });

  const acceptedQuotesSection = document.getElementById("accepted-quotes");

  const assingTeam = document.createElement("button");
  assingTeam.className = "button";
  assingTeam.textContent = "Assign Team";
  assingTeam.onclick = (quote) => assignTeam(quote);

  createQuoteBox({
    topDiv: acceptedQuotesSection,
    quoteMap: acceptedQ,
    clearTopDiv: true,
    buttonList: [assingTeam],
  });
  lc.hide();
});

function createQuoteBox({
  topDiv,
  quoteMap,
  clearTopDiv = false,
  buttonList = [],
}) {
  if (clearTopDiv) {
    topDiv.innerHTML = "";
  }

  quoteMap.forEach((quote, key) => {
    const quoteBox = document.createElement("div");
    quoteBox.className = "quote-box";
    quoteBox.innerHTML = `
    <h3>Quote #${key}</h3>
    <p>Description: ${quote.comment}</p>
  `;

    buttonList.forEach((buttonTemplate) => {
      const button = document.createElement("button");
      button.className = buttonTemplate.className;
      button.textContent = buttonTemplate.textContent;
      button.onclick = () => buttonTemplate.onclick(quote);
      quoteBox.appendChild(button);
    });

    topDiv.appendChild(quoteBox);
  });
}

function generateQuote(quote) {
  localStorage.setItem("passedVar", JSON.stringify(quote));
  window.location.href = "/generate quote/GenerateQuote(Admin).html";
}

function assignTeam(quote) {
  localStorage.setItem("passedVar", JSON.stringify(quote));
  window.location.href = "/assign team/AssignTeam(Admin).html";
}
