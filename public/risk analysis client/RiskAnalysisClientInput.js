import ServiceDA from "/classes/service/service_da.js";
// import { UserType } from "/global/enums.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import createNavBar from "/utilities/navbar.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.CLIENT) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

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
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User:", loggedInUser);

    lc.show();
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("serviceId");
    console.log(serviceId);

    let service = await ServiceDA.instance.getServiceByID({
      serviceID: serviceId,
    });

    console.log("Service:", service.toString());
    lc.updateText("Retreiving service info...");
    const questionsContainer = document.querySelector(".questions-container");
    questionsContainer.innerHTML = "";

    service.riskAnalysis.forEach((question, qIndex) => {
      const questionBlock = document.createElement("div");
      questionBlock.className = "question-block";

      const questionText = document.createElement("p");
      questionText.textContent = `Question ${qIndex + 1}: ${
        question.questionTxt
      }`;
      questionBlock.appendChild(questionText);

      question.range.forEach((range, rIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${qIndex + 1}`;
        input.value = question.values[rIndex];
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${range.toString()} `));
        questionBlock.appendChild(label);
      });

      questionsContainer.appendChild(questionBlock);
    });

    const requestQuoteBtn = document.getElementById("request-quote");
    requestQuoteBtn.onclick = async () => {
      const dialog = new ConfirmDialog({
        document: document,
        title: "Request quote?",
        message: "Are you sure you want to request this quote?",
        buttons: ["Request", "Cancel"],
        callBacks: [
          async () => {
            let lc = new LoadingScreen(document);
            lc.show("Submitting request...");
            let date = document.getElementById("service-date").value;
            let startTime = document.getElementById("start-time").value;
            let endTime = document.getElementById("end-time").value;
            let comments = document.getElementById("service-comments").value;

            let answers = [];
            service.riskAnalysis.forEach((question, qIndex) => {
              const selectedOption = document.querySelector(
                `input[name="question${qIndex + 1}"]:checked`
              );
              // console.log("Selected option:", selectedOption);
              if (selectedOption) {
                answers.push({
                  question: question.questionTxt,
                  answer: selectedOption.value,
                });
              } else {
                answers.push({
                  question: question.questionTxt,
                  answer: null,
                });
              }
            });

            let startDateTime = new Date(`${date}T${startTime}`);
            let endDateTime = new Date(`${date}T${endTime}`);

            let quote = new Quote({
              id: "",
              clientId: loggedInUser.id,
              serviceId: service.id,
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              comment: comments,
              raAnswers: answers,
            });

            let createdQuote = await QuoteDA.instance.createQuote({ quote });

            console.log("Quote:", createdQuote);
            lc.hide();
            const dialog = new ConfirmDialog({
              document: document,
              title: "Quote requested",
              message: "Quote has been requested",
              buttons: ["Ok"],
              callBacks: [() => {
                window.location.href = `/client home/client_home.html`;
              }],
            });
          },
          () => {},
        ],
      });
    };
    lc.hide();
  } catch (error) {
    console.error("Error in answering risk analysis:", error);
  }
});

function updateHomeLink(user) {
  const homeLink = document.getElementById("homeLink");
  if (!user) {
    homeLink.href = "/index.html";
  } else if (user.userType === UserType.ADMIN) {
    homeLink.href = "/admin home/Home(Admin).html";
  } else if (user.userType === UserType.CLIENT) {
    homeLink.href = "/client home/client_home.html";
  } else {
    homeLink.href = "/employee%20home/employee_home.html";
  }
}
