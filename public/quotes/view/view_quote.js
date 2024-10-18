import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let titles = [];
  let links = [];
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
  } else if (user.userType === UserType.ADMIN) {
    titles = ["Home", "Services", "Quotes", "Generate report", "My Profile"];
    links = [
      "/admin home/Home(Admin).html",
      "/services admin/ServicesAdmin.html",
      "/quotes/admin/Quotes(Admin).html",
      "/reports/Reports.html",
      "/profile/Profile.html",
    ];
  }
  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });

  const passedVar = localStorage.getItem("passedVar");
  const incompleteQuote = Quote.unStringify(passedVar);
  console.log("Unstringified quote", incompleteQuote);
  const quote = await QuoteDA.instance.completeQuoteData({
    quote: incompleteQuote,
    getClient: true,
    getAssignedTeam: true,
  });
  console.log("Completed quote data", quote);

  const quoteId = document.getElementById("quote-id");
  quoteId.textContent = quote.id;

  const status = document.getElementById("status");
  status.textContent =
    quote.status.charAt(0).toUpperCase() + quote.status.slice(1);

  const clientName = document.getElementById("client-name");
  clientName.textContent = quote.client.fullName;

  const service = document.getElementById("service-name");
  service.textContent = quote.service.name;

  const amount = document.getElementById("amount");
  amount.textContent = `R ${quote.amount.toLocaleString("en-ZA")}`;

  const startDateTime = document.getElementById("date");
  startDateTime.textContent = quote.startDateTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = document.getElementById("time");
  startTime.textContent = quote.startDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const comment = document.getElementById("comment");
  comment.textContent = quote.comment;
});
