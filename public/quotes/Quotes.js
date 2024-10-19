import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import Service from "/classes/service/service.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.CLIENT) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", async () => {
  let lc = new LoadingScreen(document);
  lc.show();
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
    const inProgressQ = allQuotes.get(Quote.sStatusInProgress);
    const pendingReviewQ = allQuotes.get(Quote.sStatusCompleted);
    const reviewedQ = allQuotes.get(Quote.sStatusReviewed);

    document.getElementById("request-btn").onclick = () => {
      const selectedServiceName = document.getElementById("service").value;
      const selectedService = allServices.find(
        (service) => service.name === selectedServiceName
      );
      window.location.href = `/risk analysis client/RiskAnalysisClientInput.html?serviceId=${selectedService.id}`;
    };

    // service for submitting request
    const serviceDropDown = document.getElementById("service");
    serviceDropDown.innerHTML = "";

    // service for filtering
    const serviceSelect = document.getElementById("filter-service");
    serviceSelect.innerHTML = "";
    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = "None";
    serviceSelect.appendChild(noneOption);

    serviceDropDown.onchange = () => updateDescription(allServices);

    allServices.forEach((service) => {
      const option = document.createElement("option");
      option.value = service.name;
      option.textContent = service.name;
      serviceDropDown.appendChild(option);

      // console.log("Service options:", service);
      const filterOption = document.createElement("option");
      // const fromArrayService = Service.fromJsonArray(service);
      // console.log("Service options:", fromArrayService);
      filterOption.value = JSON.stringify(service);
      filterOption.textContent = service.name;
      serviceSelect.appendChild(filterOption);
    });

    populatePage(requestedQ, quotedQ, inProgressQ, pendingReviewQ, reviewedQ);

    const fileterBtn = document.getElementById("filter-btn");
    fileterBtn.onclick = () => {
      let lcf = new LoadingScreen(document);
      lcf.show("Filtering Quotes...");
      const serviceSelect = document.getElementById("filter-service");
      const fromDateInput = document.getElementById("filter-from-date");
      const toDateInput = document.getElementById("filter-to-date");

      const service =
        serviceSelect.value === ""
          ? null
          : Service.unStringify(serviceSelect.value);
      const fromDate = fromDateInput.value ? fromDateInput.value : null;
      const toDate = toDateInput.value ? toDateInput.value : null;

      if (!service && !fromDate && !toDate) {
        const dialog = new ConfirmDialog({
          document: document,
          title: "Error!",
          message: "Please select at least one filter",
          buttons: ["Ok"],
          callBacks: [() => {}],
        });
      }

      const filterRequested = filterQuotes(
        requestedQ,
        service !== null ? service.id : null,
        fromDate,
        toDate
      );

      const filterQuoted = filterQuotes(
        quotedQ,
        service !== null ? service.id : null,
        fromDate,
        toDate
      );

      const filterInProgress = filterQuotes(
        inProgressQ,
        service !== null ? service.id : null,
        fromDate,
        toDate
      );

      const filterPendingReview = filterQuotes(
        pendingReviewQ,
        service !== null ? service.id : null,
        fromDate,
        toDate
      );

      const filterReviewed = filterQuotes(
        reviewedQ,
        service !== null ? service.id : null,
        fromDate,
        toDate
      );

      populatePage(
        filterRequested,
        filterQuoted,
        filterInProgress,
        filterPendingReview,
        filterReviewed
      );

      lcf.hide();
    };

    const undoBtn = document.getElementById("undo-filter");
    undoBtn.onclick = () => {
      window.location.reload();
    };
  } catch (error) {
    console.error("Error in make quote request:", error);
  }
  lc.hide();
});

function createQuoteBox({
  topDiv,
  quoteMap,
  topHeading,
  clearTopDiv = false,
  buttonCallbacks = [],
}) {
  if (clearTopDiv) {
    topDiv.innerHTML = "";
  }

  if (quoteMap.size === 0 && topHeading) {
    // console.log(topHeading);
    topHeading.style.display = "none";
    // topHeading.remove();
    return;
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

function populatePage(
  requestedQ,
  quotedQ,
  inProgressQ,
  pendingReviewQ,
  reviewedQ
) {
  // const viewQuoteButton = document.createElement("button");
  // viewQuoteButton.className = "button";
  // viewQuoteButton.textContent = "View Quote";
  // viewQuoteButton.onclick = (quote) => viewQuote(quote);

  const viewQuoteButton = {
    text: "View Quote",
    className: "button",
    callback: (quote) => viewQuote(quote),
  };

  const requestedQuotes = document.getElementById("requested-quotes");
  const requestHeading = document.getElementById("requested-quotes-heading");
  createQuoteBox({
    topDiv: requestedQuotes,
    quoteMap: requestedQ,
    topHeading: requestHeading,
    clearTopDiv: true,
    buttonCallbacks: [viewQuoteButton],
  });

  const quotedQuotes = document.getElementById("quoted-quotes");
  const quotedHeading = document.getElementById("quoted-quotes-heading");
  createQuoteBox({
    topDiv: quotedQuotes,
    quoteMap: quotedQ,
    topHeading: quotedHeading,
    clearTopDiv: true,
    buttonCallbacks: [
      {
        text: "Accept Quote",
        className: "button accept-button",
        callback: async (quote) => {
          const dialog = new ConfirmDialog({
            document: document,
            title: "Accept Quote?",
            message: `Are you sure you want to 'Accept' Quote for #${quote.id}?`,
            buttons: ["Accept", "Cancel"],
            callBacks: [
              async () => {
                let lc = new LoadingScreen(document);
                lc.show("Accepting Quote...");
                quote.status = Quote.sStatusAccepted;
                await QuoteDA.instance.updateQuote({ quote: quote });
                quotedQ.delete(quote.id);
                lc.hide();
                location.reload();
              },
              () => {},
            ],
          });
        },
      },
      {
        text: "Reject Quote",
        className: "button reject-button",
        callback: async (quote) => {
          const dialog = new ConfirmDialog({
            document: document,
            title: "Reject Quote?",
            message: `Are you sure you want to 'Reject' Quote for #${quote.id}?`,
            buttons: ["Reject", "Cancel"],
            callBacks: [
              async () => {
                let lc = new LoadingScreen(document);
                lc.show("Rejecting Quote...");
                quote.status = Quote.sStatusRejected;
                await QuoteDA.instance.updateQuote({ quote: quote });
                quotedQ.delete(quote.id);
                lc.hide();
                location.reload();
              },
              () => {},
            ],
          });
        },
      },
      viewQuoteButton,
    ],
  });

  // const filteredQuotes = new Map(
  //   [...acceptedQ].filter(([key, quote]) => quote.team !== null)
  // );

  const acceptedQuotes = document.getElementById("in-progress-quotes");
  const inProgressHeading = document.getElementById(
    "in-progress-quotes-heading"
  );
  createQuoteBox({
    topDiv: acceptedQuotes,
    quoteMap: inProgressQ,
    topHeading: inProgressHeading,
    clearTopDiv: true,
    buttonCallbacks: [viewQuoteButton],
  });

  const completedQuotes = document.getElementById("completed-quotes");
  const completedHeading = document.getElementById("completed-quotes-heading");
  createQuoteBox({
    topDiv: completedQuotes,
    quoteMap: pendingReviewQ,
    topHeading: completedHeading,
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
      viewQuoteButton,
    ],
  });

  const reviewedQuotes = document.getElementById("reviewed-quotes");
  const reviewedHeading = document.getElementById("reviewed-quotes-heading");
  createQuoteBox({
    topDiv: reviewedQuotes,
    topHeading: reviewedHeading,
    quoteMap: reviewedQ,
    clearTopDiv: true,
    buttonCallbacks: [viewQuoteButton],
  });
}

function viewQuote(quote) {
  localStorage.setItem("passedVar", JSON.stringify(quote));
  window.location.href = "/quotes/view/ViewQuote.html";
}

function filterQuotes(quoteMap, serviceID, strFromDate, strToDate) {
  let filteredQuotes = new Map();
  // console.log(quoteMap, serviceID, clientID, strFromDate, strToDate);
  let fromDate = null;
  if (strFromDate) {
    fromDate = new Date(strFromDate);
  }

  let toDate = null;
  if (strToDate) {
    toDate = new Date(strToDate);
  }

  quoteMap.forEach((quote, key) => {
    // if (serviceID && quote.serviceId === serviceID) {
    //   filteredQuotes.set(key, quote);
    // }
    // console.log("Quote date:", quote.startDateTime);
    // if (fromDate && quote.startDateTime >= fromDate) {
    //   filteredQuotes.set(key, quote);
    // }
    // if (toDate && quote.startDateTime <= toDate) {
    //   filteredQuotes.set(key, quote);
    // }
    if (
      (!serviceID || quote.serviceId === serviceID) &&
      (!fromDate || quote.startDateTime >= fromDate) &&
      (!toDate || quote.startDateTime <= toDate)
    ) {
      filteredQuotes.set(key, quote);
    }
  });
  return filteredQuotes;
}
