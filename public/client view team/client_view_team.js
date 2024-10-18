import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let titles = [];
  let links = [];
  let addlogout = false;
  if (user.userType === UserType.CLIENT) {
    titles = [
      "Home",
      "Our Services",
      "About us",
      "Contact us",
      "FAQs",
      "Quotes",
      "My Profile",
    ];
    links = [
      "/client home/client_home.html",
      "/view services/OurServices.html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/FAQ/FAQs.html",
      "/quotes/Quotes.html",
      "/profile/Profile.html",
    ];
    addlogout = true;
  } else if (user.userType === UserType.EMPLOYEE) {
    titles = ["Home", "About us", "Contact us", "View teams", "My Profile"];
    links = [
      "/employee home/Home(Employee).html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/client view team/clientViewTeam.html",
      "/profile/Profile.html",
    ];
    addlogout = true;
  }
  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: addlogout,
  });

  let lc = new LoadingScreen(document);
  lc.show();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  lc.updateText("Fetching all your quotes...");
  const allServices = JSON.parse(localStorage.getItem("allServices"));
  let allQuotes = await QuoteDA.instance.getAllQuotesForUser({
    user: loggedInUser,
  });
  // console.log(user.id);
  // console.log(allQuotes);
  lc.updateText("Laying them out for you...");
  const acceptedQ = allQuotes.get(Quote.sStatusAccepted);
  const inProgressQ = allQuotes.get(Quote.sStatusInProgress);
  const allQuotesNotCompleted = new Map();
  await completeAndUpdateQuotes(allQuotesNotCompleted, acceptedQ);
  await completeAndUpdateQuotes(allQuotesNotCompleted, inProgressQ);
  // console.log(acceptedQ);
  // console.log(inProgressQ);
  // console.log(allQuotesNotCompleted);
  lc.updateText("Updating options...");
  const quoteSelect = document.getElementById("quote-select");
  quoteSelect.innerHTML = "";
  allQuotesNotCompleted.forEach((quote, quoteID) => {
    const option = document.createElement("option");
    option.value = quoteID;
    option.textContent = `Quote #${quote.id} - ${quote.service.name} for ${quote.client.fullName}`;
    quoteSelect.appendChild(option);
  });
  quoteSelect.onchange = function () {
    const selectedQuoteID = quoteSelect.value;
    // console.log("Selected Quote ID:", selectedQuoteID);
    const selectedQuote = allQuotesNotCompleted.get(selectedQuoteID);
    // console.log(selectedQuote);

    // only remove the default values
    const tbody = document.querySelector("#team-table tbody");
    tbody.innerHTML = "";

    const team = selectedQuote.team;
    // console.log(team);
    team.forEach((member) => {
      // console.log(member);
      const row = tbody.insertRow();
      const nameCell = row.insertCell(0);
      const roleCell = row.insertCell(1);
      const emailCell = row.insertCell(2);

      nameCell.textContent = member.fullName;
      roleCell.textContent = "Security expert";
      emailCell.textContent = member.email;
    });
  };

  // Ensure the quoteSelect is populated before setting the value
  // if (allQuotesNotCompleted.size > 0) {
  //   const firstQuote = allQuotesNotCompleted.entries().next().value;
  //   // quoteSelect.value = null;
  //   console.log("First Quote:", firstQuote);
  //   quoteSelect.value = firstQuote[0];
  //   console.log("First Quote ID:", quoteSelect.value);
  //   const tbody = document.querySelector("#team-table tbody");
  //   tbody.innerHTML = "";
  //   const team = firstQuote[1].team;
  //   console.log("First team: ", team);
  //   for (let i = 0; i < team.length; i++) {
  //     console.log("Team Member:", team[i]);
  //     const row = tbody.insertRow();
  //     const nameCell = row.insertCell(0);
  //     const roleCell = row.insertCell(1);
  //     const emailCell = row.insertCell(2);

  //     nameCell.textContent = team[i].fullName;
  //     roleCell.textContent = "Security expert";
  //     emailCell.textContent = team[i].email;
  //   }
  //   // team.forEach((member) => {
  //   //   console.log("Team Member:", member);
  //   //   const row = tbody.insertRow();
  //   //   const nameCell = row.insertCell(0);
  //   //   const roleCell = row.insertCell(1);
  //   //   const emailCell = row.insertCell(2);

  //   //   nameCell.textContent = member.fullName;
  //   //   roleCell.textContent = "Security expert";
  //   //   emailCell.textContent = member.email;
  //   // });
  // } else {
  //   console.log("No quotes available.");
  // }

  quoteSelect.value = null;
  const tbody = document.querySelector("#team-table tbody");
  tbody.innerHTML = "";
  lc.hide();
});

// Function to complete and update quote data
async function completeAndUpdateQuotes(addToMap, quotesMap) {
  const promises = [];

  quotesMap.forEach((quote, quoteID) => {
    const promise = QuoteDA.instance
      .completeQuoteData({
        quote: quote,
        getClient: true,
        getAssignedTeam: true,
      })
      .then((completedQuote) => {
        addToMap.set(quoteID, completedQuote);
      })
      .catch((error) => {
        console.error(
          `Error completing quote data for quote ID ${quoteID}:`,
          error
        );
      });

    promises.push(promise);
  });

  // Wait for all promises to complete
  await Promise.all(promises);
  return addToMap;
}
