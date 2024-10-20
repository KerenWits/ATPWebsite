import Question from "/classes/service/question.js";
import ServiceDA from "/classes/service/service_da.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import { UserType } from "/global/enums.js";
import createNavBar from "/utilities/navbar.js";

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
});

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
    const dialog = new ConfirmDialog({
      document: document,
      title: "Risk analysis question created successfully",
      message: "Risk analysis question successfully recorded",
      buttons: ["Ok"],
      callBacks: [
        () => {
          const dialog = new ConfirmDialog({
            document: document,
            title: "Add another question?",
            message: "Would you like to add another question?",
            buttons: ["Yes", "No"],
            callBacks: [
              async () => {
                // Clear the input for the next question
                questionInput.value = "";
              },
              () => {
                window.location.href = "/admin home/Home(Admin).html";
              },
            ],
          });
        },
      ],
    });
  } else {
    console.log("Error adding question");
  }
}
