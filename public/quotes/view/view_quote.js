import createNavBar from "/utilities/navbar.js";
// import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (
  !user ||
  (user.userType !== UserType.CLIENT && user.userType !== UserType.ADMIN)
) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}
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
    titles = [
      "Home",
      "Employees",
      "Services",
      "Quotes",
      "Generate report",
      "My Profile",
    ];
    links = [
      "/admin home/Home(Admin).html",
      "/current employees/current_employees.html",
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
  if (quote.amount != null) {
    amount.textContent = `R ${quote.amount.toLocaleString("en-ZA")}`;
  } else {
    amount.textContent = "N/A";
  }

  const startDate = document.getElementById("date");
  startDate.textContent = quote.startDateTime.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = document.getElementById("time");
  const startTime = quote.startDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = quote.endDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  time.textContent = `${startTime} - ${endTime}`;

  const comment = document.getElementById("comment");
  comment.textContent = quote.comment ?? "N/A";

  const riskAnalysis = document.getElementById("risk-analysis");
  riskAnalysis.innerHTML = "";
  quote.raAnswers.forEach((answer, index) => {
    const raQ = document.createElement("p");
    raQ.textContent = `${index + 1}. ${answer.question}`;
    const raA = document.createElement("p");
    raA.textContent = `Answer: ${answer.answer === 1 ? "Yes" : "No"}`;
    riskAnalysis.appendChild(raQ);
    riskAnalysis.appendChild(raA);
  });

  const assignedTeam = document.getElementById("assigned-team");
  assignedTeam.innerHTML = "";

  if (quote.team && quote.team.length > 0) {
    quote.team.forEach((employee) => {
      const teamMember = document.createElement("li");
      teamMember.textContent = employee.fullName;
      assignedTeam.appendChild(teamMember);
    });
  } else {
    assignedTeam.textContent = "No Assigned Team";
  }

  const reviewText = document.getElementById("review-text");
  reviewText.textContent = quote.reviewComments ?? "N/A";

    const reviewRating = document.getElementById("review-stars");
  if (quote.reviewRating) {
    reviewRating.remove();
  } else {
    reviewRating.textContent = quote.reviewRating;
  }
});
