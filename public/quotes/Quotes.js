import updateHomeLink from "/utilities/homeLink.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    updateHomeLink(document, loggedInUser);

    const allServices = JSON.parse(localStorage.getItem("allServices"));
    let allQuotes = await QuoteDA.instance.getAllQuotesForUser({ user: loggedInUser });
    console.log(allQuotes);

    const requestedQ = allQuotes.get(Quote.sStatusRequested);
    const quotedQ = allQuotes.get(Quote.sStatusQuoted);
    const acceptedQ = allQuotes.get(Quote.sStatusAccepted);
    const reviewedQ = allQuotes.get(Quote.sStatusReviewed);

    document.getElementById("request-btn").onclick = () => {
      const selectedServiceName = document.getElementById("service").value;
      const selectedService = allServices.find(
        (service) => service.name === selectedServiceName
      );
      window.location.href = `/risk analysis client/RiskAnalysisClientInput.html?serviceId=${selectedService.id}`;
    };

    const serviceDropDown = document.getElementById("service");
    serviceDropDown.innerHTML = "";

    serviceDropDown.onchange = updateDescription;

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
    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept Quote";
    acceptBtn.className = "button accept-button";
    acceptBtn.onclick = async () => {
      let lc = new LoadingScreen(document);
      lc.show("Accepting Quote...");
      let unQuote = Quote.unStringify(quote);
      unQuote.status = Quote.sStatusAccepted;
      await QuoteDA.instance.updateQuote({ quote: unQuote });
      quotedQ = quotedQ.filter((q) => q.id !== quote.id);
      lc.hide();
    };

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject Quote";
    rejectBtn.className = "button reject-button";
    rejectBtn.onclick = async () => {
      let lc = new LoadingScreen(document);
      lc.show("Rejecting Quote...");
      let unQuote = Quote.unStringify(quote);
      unQuote.status = Quote.sStatusRejected;
      await QuoteDA.instance.updateQuote({ quote: unQuote });
      lc.hide();
    };
    createQuoteBox({
      topDiv: quotedQuotes,
      quoteMap: quotedQ,
      clearTopDiv: true,
      buttonList: [acceptBtn, rejectBtn],
    });

    // const acceptedQuotes = document.getElementById("accepted-quotes");
    // createQuoteBox({
    //   topDiv: acceptedQuotes,
    //   quoteMap: acceptedQ,
    //   clearTopDiv: true,
    // });
  } catch (error) {
    console.error("Error in make quote request:", error);
  }
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
    <p>${quote.service.name}</p>
  `;

    buttonList.forEach((button) => {
      quoteBox.appendChild(button);
    });
    topDiv.appendChild(quoteBox);
  });
}

function updateDescription() {
  const selectedServiceName = document.getElementById("service").value;
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
