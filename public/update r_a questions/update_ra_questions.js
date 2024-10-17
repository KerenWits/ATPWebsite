import Service from "/classes/service/service.js";
import ServiceDA from "/classes/service/service_da.js";
import createNavBar from "/utilities/navbar.js";
import Question from "/classes/service/question.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

document.addEventListener("DOMContentLoaded", () => {
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

  const passedVar = localStorage.getItem("passedVar");
  let service = Service.unStringify(passedVar);
  console.log(service);

  const questionDropdown = document.getElementById("select-question");
  questionDropdown.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Select a question";
  questionDropdown.appendChild(emptyOption);
  questionDropdown.value = "";
  const questions = service.riskAnalysis;
  questions.forEach((question, index) => {
    const option = document.createElement("option");
    option.value = index; // Set the value to the index of the question
    option.textContent = question.questionTxt;
    questionDropdown.appendChild(option);
  });

  const updateQuestionBtn = document.getElementById("update-question-btn");
  updateQuestionBtn.addEventListener("click", () => {
    const questionIndex = questionDropdown.value;
    if (questionIndex === "") {
      alert("Please select a question to update");
      return;
    }
    const updatedQuestion = document.getElementById("question-txt").value;
    if (updatedQuestion === "") {
      alert("Please enter the updated question");
      return;
    }
    updateQuestion(service, parseInt(questionIndex), updatedQuestion);
  });

  const addQuestionBtn = document.getElementById("add-question-btn");
  addQuestionBtn.addEventListener("click", () => {
    const newQuestion = document.getElementById("new-question-txt").value;
    if (newQuestion === "") {
      alert("Please enter the new question");
      return;
    }
    addQuestion(service, newQuestion);
  });

  const deleteQuestionBtn = document.getElementById("delete-question-btn");
  deleteQuestionBtn.addEventListener("click", () => {
    const questionIndex = questionDropdown.value;
    if (questionIndex === "") {
      alert("Please select a question to delete");
      return;
    }
    deleteQuestion(service, parseInt(questionIndex));
  });
});

function showConfirmationDialog({ title, message, onConfirm, onCancel }) {
  const dialog = new ConfirmDialog({
    document: document,
    title: title,
    message: message,
    buttons: ["Confirm", "Cancel"],
    callBacks: [onConfirm, onCancel],
  });
}

function showResultDialog({ title, message }) {
  const dialog = new ConfirmDialog({
    document: document,
    title: title,
    message: message,
    buttons: ["Ok"],
    callBacks: [() => {}],
  });
}

function updateQuestion(service, index, newQuestion) {
  showConfirmationDialog({
    title: "Update?",
    message: `Are you sure you want to update Question ${index + 1} from "${
      service.riskAnalysis[index].questionTxt
    }" to "${newQuestion}"?`,
    onConfirm: async () => {
      let lc = new LoadingScreen(document);
      lc.show();
      try {
        service.riskAnalysis[index].questionTxt = newQuestion;
        await ServiceDA.instance.updateService({ service: service });
        document.getElementById("question-txt").value = "";
        document.getElementById("select-question").value = "";
        lc.hide();
        showResultDialog({
          title: "Success",
          message: `Question ${index + 1} updated successfully.`,
        });
      } catch (e) {
        lc.hide();
        showResultDialog({
          title: "Failed",
          message: `Failed to update Question ${
            index + 1
          }. Please try again. Error: ${e.toString()}`,
        });
      }
    },
    onCancel: () => {},
  });
}

function addQuestion(service, newQuestionTxt) {
  const index = service.riskAnalysis.length;
  showConfirmationDialog({
    title: "Add?",
    message: `Are you sure you want to add Question ${index + 1} to ${
      service.name
    }?`,
    onConfirm: async () => {
      let lc = new LoadingScreen(document);
      lc.show();
      try {
        const newQuestion = new Question({
            questionTxt: newQuestionTxt,
            range: ["Yes", "No",],
            values: [1, 0],
        });
        service.riskAnalysis.push(newQuestion);
        await ServiceDA.instance.updateService({ service: service });
        document.getElementById("new-question-txt").value = "";
        document.getElementById("select-question").value = "";
        lc.hide();
        showResultDialog({
          title: "Success",
          message: `Question ${index + 1} added successfully.`,
        });
      } catch (e) {
        lc.hide();
        showResultDialog({
          title: "Failed",
          message: `Failed to add Question ${
            index + 1
          }. Please try again. Error: ${e.toString()}`,
        });
      }
    },
    onCancel: () => {},
  });
}

function deleteQuestion(service, index) {
  showConfirmationDialog({
    title: "Delete?",
    message: `Are you sure you want to delete Question ${index + 1}?`,
    onConfirm: async () => {
      let lc = new LoadingScreen(document);
      lc.show();
      try {
        service.riskAnalysis.splice(index, 1);
        await ServiceDA.instance.updateService({ service: service });
        document.getElementById("select-question").value = "";
        lc.hide();
        showResultDialog({
          title: "Success",
          message: `Question ${index + 1} deleted successfully.`,
        });
      } catch (e) {
        lc.hide();
        showResultDialog({
          title: "Failed",
          message: `Failed to delete Question ${
            index + 1
          }. Please try again. Error: ${e.toString()}`,
        });
      }
    },
    onCancel: () => {},
  });
}
