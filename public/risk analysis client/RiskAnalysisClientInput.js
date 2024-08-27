import ServiceDA from "/classes/service/service_da.js";
import { UserType } from "/global/enums.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User:", loggedInUser);
    updateHomeLink(loggedInUser);

    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("serviceId");
    console.log(serviceId);

    let service = await ServiceDA.instance.getServiceByID({
      serviceID: serviceId,
    });

    console.log("Service:", service.toString());

    const questionsContainer = document.querySelector(".questions-container");
    questionsContainer.innerHTML = "";

    service.riskAnalysis.forEach((question, index) => {
      const questionBlock = document.createElement("div");
      questionBlock.className = "question-block";

      const questionText = document.createElement("p");
      questionText.textContent = `Question ${index + 1}: ${
        question.questionTxt
      }`;
      questionBlock.appendChild(questionText);

      question.range.forEach((range, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${index + 1}`;
        input.value = question.values[index];
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${range.toString()} `));
        questionBlock.appendChild(label);
      });

      questionsContainer.appendChild(questionBlock);
    });

    const requestQuoteBtn = document.getElementById("request-quote");
    requestQuoteBtn.onclick = async () => {
      let date = document.getElementById("service-date").value;
      let startTime = document.getElementById("start-time").value;
      let endTime = document.getElementById("end-time").value;
      let comments = document.getElementById("service-comments").value;

      let answers = [];
      service.riskAnalysis.forEach((question, index) => {
        const selectedOption = document.querySelector(
          `input[name="question${index + 1}"]:checked`
        );
        if (selectedOption) {
          answers.push({
            question: question.questionTxt,
            answer: selectedOption.value,
          });
        } else {
          answers.push({
            question: question.questionTxt,
            answer: null, // or any default value indicating no selection
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
    };
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
