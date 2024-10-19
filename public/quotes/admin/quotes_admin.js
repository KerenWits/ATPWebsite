import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import createNavBar from "/utilities/navbar.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import UserDA from "/classes/users/userDA.js";
import Service from "/classes/service/service.js";
import Client from "/classes/users/client.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.ADMIN) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", async () => {
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

  populatePage(requestedQ, acceptedQ, reviewedQ);
  
  const filterBtn = document.getElementById("filter-btn");
  filterBtn.onclick = () => {
    const serviceSelect = document.getElementById("filter-service");
    const clientSelect = document.getElementById("filter-client");
    const fromDateInput = document.getElementById("filter-from-date");
    const toDateInput = document.getElementById("filter-to-date");

    const service =
      serviceSelect.value === ""
        ? null
        : Service.unStringify(serviceSelect.value);
    const client =
      clientSelect.value === "" ? null : Client.unStringify(clientSelect.value);
    const fromDate = fromDateInput.value ? fromDateInput.value : null;
    const toDate = toDateInput.value ? toDateInput.value : null;

    if (!service && !client && !fromDate && !toDate) {
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
      client !== null ? client.id : null,
      fromDate,
      toDate
    );

    const filterAccepted = filterQuotes(
      acceptedQ,
      service !== null ? service.id : null,
      client !== null ? client.id : null,
      fromDate,
      toDate,
    );

    const filterReviewed = filterQuotes(
      reviewedQ,
      service !== null ? service.id : null,
      client !== null ? client.id : null,
      fromDate,
      toDate,
    );

    populatePage(filterRequested, filterAccepted, filterReviewed);
  };

  const allServices = JSON.parse(localStorage.getItem("allServices"));
  // console.log("Services:", allServices);
  const serviceSelect = document.getElementById("filter-service");
  serviceSelect.innerHTML = "";
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "None";
  serviceSelect.appendChild(noneOption);
  allServices.forEach((service) => {
    // console.log("Service options:", service);
    const option = document.createElement("option");
    // const fromArrayService = Service.fromJsonArray(service);
    // console.log("Service options:", fromArrayService);
    option.value = JSON.stringify(service);
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  });

  let allClients = await UserDA.instance.getAllClients({ rethrowError: true });
  // console.log("Clients:", allClients);

  const clientSelect = document.getElementById("filter-client");
  clientSelect.innerHTML = "";
  const noneClientOption = document.createElement("option");
  noneClientOption.value = "";
  noneClientOption.textContent = "None";
  clientSelect.appendChild(noneClientOption);
  allClients.forEach((client) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(client);
    option.textContent = client.fullName;
    clientSelect.appendChild(option);
  });

  const undoBtn = document.getElementById("undo-filter");
  undoBtn.onclick = () => {
    window.location.reload();
  };

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
    <p>Comment: ${quote.comment}</p>
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

function viewQuote(quote) {
  localStorage.setItem("passedVar", JSON.stringify(quote));
  window.location.href = "/quotes/view/ViewQuote.html";
}

function filterQuotes(quoteMap, serviceID, clientID, strFromDate, strToDate) {
  let filteredQuotes = new Map();
  console.log(quoteMap, serviceID, clientID, strFromDate, strToDate);
  let fromDate = null;
  if (strFromDate) {
    fromDate = new Date(strFromDate);
  }

  let toDate = null;
  if(strToDate) {
    toDate = new Date(strToDate);
  }

  quoteMap.forEach((quote, key) => {
    // if (clientID && quote.clientId === clientID) {
    //   filteredQuotes.set(key, quote);
    // }
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
      (!clientID || quote.clientId === clientID) &&
      (!fromDate || quote.startDateTime >= fromDate) &&
      (!toDate || quote.startDateTime <= toDate)
    ) {
      filteredQuotes.set(key, quote);
    }
  });
  return filteredQuotes;
}

function populatePage(requestedQ, acceptedQ, reviewedQ) {
  const viewQuoteButton = document.createElement("button");
  viewQuoteButton.className = "button";
  viewQuoteButton.textContent = "View Quote";
  viewQuoteButton.onclick = (quote) => viewQuote(quote);

  const requestedQuotesSection = document.getElementById("requested-quotes");
  requestedQuotesSection.innerHTML = "";

  if (requestedQ.size > 0) {
    const quoteButton = document.createElement("button");
    quoteButton.className = "button";
    quoteButton.textContent = "Generate Quote";
    quoteButton.onclick = (quote) => generateQuote(quote);

    createQuoteBox({
      topDiv: requestedQuotesSection,
      quoteMap: requestedQ,
      clearTopDiv: true,
      buttonList: [quoteButton, viewQuoteButton],
    });
  } else {
    const noQuotesToGenerate = document.createElement("h3");
    noQuotesToGenerate.textContent = "No quotes to generate";
    requestedQuotesSection.appendChild(noQuotesToGenerate);
  }

  const acceptedQuotesSection = document.getElementById("accepted-quotes");
  acceptedQuotesSection.innerHTML = "";
  if (acceptedQ.size > 0) {
    const assingTeam = document.createElement("button");
    assingTeam.className = "button";
    assingTeam.textContent = "Assign Team";
    assingTeam.onclick = (quote) => assignTeam(quote);

    createQuoteBox({
      topDiv: acceptedQuotesSection,
      quoteMap: acceptedQ,
      clearTopDiv: true,
      buttonList: [assingTeam, viewQuoteButton],
    });
  } else {
    const noQuotesToAssign = document.createElement("h3");
    noQuotesToAssign.textContent = "No quotes to assign team";
    acceptedQuotesSection.appendChild(noQuotesToAssign);
  }

  const reviewedQuotesSection = document.getElementById("reviewed-quotes");
  reviewedQuotesSection.innerHTML = "";
  console.log(reviewedQ.size);
  if (reviewedQ.size > 0) {
    createQuoteBox({
      topDiv: reviewedQuotesSection,
      quoteMap: reviewedQ,
      clearTopDiv: true,
      buttonList: [viewQuoteButton],
    });
  } else {
    console.log("No quotes to review");
    const noQuotesToReview = document.createElement("h3");
    noQuotesToReview.textContent = "No Reviewed Quotes";
    reviewedQuotesSection.appendChild(noQuotesToReview);
  }
}
