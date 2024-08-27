import Question from "/classes/service/question.js";
import ServiceDA from "/classes/service/service_da.js";

// Parse the query string
const params = new URLSearchParams(window.location.search);

// Retrieve the serviceId from the query string
const serviceId = params.get("serviceId");

console.log(serviceId);

// Handle form submission
document
  .getElementById("questionForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    await addRiskAnaylsisQuestion();
  });

async function addRiskAnaylsisQuestion() {
  const questionInput = document.getElementById("question-input");
  let questionTxt = questionInput.value;
  let range = ["yes", "no"];
  let values = [1, 0];
  let question = new Question({
    questionTxt: questionTxt,
    range: range,
    values: values,
  });

//   console.log("ServiceID:", serviceId, "Question:", question.toString());
  let updatedService = await ServiceDA.instance.addAQuestionWithID({
    serviceID: serviceId,
    question: question,
  });
  if (updatedService) {
    console.log("Question added successfully", updatedService.toString());
    // Clear the input for the next question
    questionInput.value = "";
  } else {
    console.log("Error adding question");
  }
}
