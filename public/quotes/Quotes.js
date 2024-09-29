import updateHomeLink from "/utilities/homeLink.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import createNavBar from "/utilities/navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const titles = [
      "Home",
      "Our Services",
      "About us",
      "Contact us",
      "FAQs",
      "Quotes",
      "My Profile",
    ];
    const links = [
      "/client home/client_home.html",
      "/view services/OurServices.html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/FAQ/FAQs.html",
      "/quotes/Quotes.html",
      "/profile/Profile.html",
    ];

    createNavBar({
      document: document,
      titles: titles,
      links: links,
      addLogout: true,
    });
    let lc = new LoadingScreen(document);
    lc.show();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    lc.updateText("Fetching all your quotes...");
    const allServices = JSON.parse(localStorage.getItem("allServices"));
    let allQuotes = await QuoteDA.instance.getAllQuotesForUser({
      user: loggedInUser,
    });
    console.log(allQuotes);
    lc.updateText("Laying them out for you...");
    const requestedQ = allQuotes.get(Quote.sStatusRequested);
    const quotedQ = allQuotes.get(Quote.sStatusQuoted);
    const acceptedQ = allQuotes.get(Quote.sStatusAccepted);
    const pendingReviewQ = allQuotes.get(Quote.sStatusCompleted);
    lc.hide();

    document.getElementById("request-btn").onclick = () => {
      const selectedServiceName = document.getElementById("service").value;
      const selectedService = allServices.find(
        (service) => service.name === selectedServiceName
      );
      window.location.href = `/risk analysis client/RiskAnalysisClientInput.html?serviceId=${selectedService.id}`;
    };

    const serviceDropDown = document.getElementById("service");
    serviceDropDown.innerHTML = "";

    serviceDropDown.onchange = () => updateDescription(allServices);

    allServices.forEach((service) => {
      const option = document.createElement("option");
      option.value = service.name;
      option.textContent = service.name;
      serviceDropDown.appendChild(option);
    });

    const requestedQuotes = document.getElementById("requested-quotes");
    createQuoteBox({
      topDiv: requestedQuotes,
      quoteMap: requestedQ,
      clearTopDiv: true,
    });

    const quotedQuotes = document.getElementById("quoted-quotes");
    createQuoteBox({
      topDiv: quotedQuotes,
      quoteMap: quotedQ,
      clearTopDiv: true,
      buttonCallbacks: [
        {
          text: "Accept Quote",
          className: "button accept-button",
          callback: async (quote) => {
            let lc = new LoadingScreen(document);
            lc.show("Accepting Quote...");
            quote.status = Quote.sStatusAccepted;
            await QuoteDA.instance.updateQuote({ quote: quote });
            quotedQ.delete(quote.id);
            lc.hide();
            location.reload();
          },
        },
        {
          text: "Reject Quote",
          className: "button reject-button",
          callback: async (quote) => {
            let lc = new LoadingScreen(document);
            lc.show("Rejecting Quote...");
            quote.status = Quote.sStatusRejected;
            await QuoteDA.instance.updateQuote({ quote: quote });
            quotedQ.delete(quote.id);
            lc.hide();
            location.reload();
          },
        },
      ],
    });

    const filteredQuotes = new Map(
      [...acceptedQ].filter(([key, quote]) => quote.team !== null)
    );

    const acceptedQuotes = document.getElementById("accepted-quotes");
    createQuoteBox({
      topDiv: acceptedQuotes,
      quoteMap: filteredQuotes,
      clearTopDiv: true,
    });

    const completedQuotes = document.getElementById("completed-quotes");
    createQuoteBox({
      topDiv: completedQuotes,
      quoteMap: pendingReviewQ,
      clearTopDiv: true,
      buttonCallbacks: [
        {
          text: "Review Quote",
          className: "button",
          callback: async (quote) => {
            localStorage.setItem("passedVar", JSON.stringify(quote));
            window.location.href = `/review service/reviewService.html`;
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error in make quote request:", error);
  }
});

function createQuoteBox({
  topDiv,
  quoteMap,
  clearTopDiv = false,
  buttonCallbacks = [],
}) {
  if (clearTopDiv) {
    topDiv.innerHTML = "";
  }

  quoteMap.forEach((quote, key) => {
    const quoteBox = document.createElement("div");
    quoteBox.className = "quote-box";
    quoteBox.innerHTML = `
    <h3>Quote #${key}</h3>
    <p>${quote.service.name}</p>
  `;

    buttonCallbacks.forEach(({ text, className, callback }) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.className = className;
      button.onclick = () => callback(quote);
      quoteBox.appendChild(button);
    });

    topDiv.appendChild(quoteBox);
  });
}

function updateDescription(allServices) {
  // console.log("updateDescription called", allServices);
  const selectedServiceName = document.getElementById("service").value;
  // console.log("selectedServiceName", selectedServiceName);
  const selectedService = allServices.find(
    (service) => service.name === selectedServiceName
  );
  const descriptionBox = document.getElementById("description-box");

  if (selectedService) {
    descriptionBox.innerHTML = `<p>${selectedService.description}</p>`;
  } else {
    descriptionBox.innerHTML = `<p>Select a service to see its description.</p>`;
  }
}
