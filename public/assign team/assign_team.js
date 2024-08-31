import createNavBar from "/utilities/navbar.js";
import EmployeeDA from "/classes/users/employee_da.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";

document.addEventListener("DOMContentLoaded", async () => {
  let quote = localStorage.getItem("passedVar");
  //   console.log("stringified quote: ",quote);
  quote = Quote.unStringify(quote);
  //   console.log("unstringified quote", quote);
  quote = await QuoteDA.instance.completeQuoteData({
    quote: quote,
    getClient: true,
    rethrowError: false,
  });
  console.log(quote);

  const titles = [
    "Home",
    "Services",
    "Quotes",
    "Generate report",
    "My Profile",
  ];
  const links = [
    "/admin home/Home(Admin).html",
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

  const quoteInfo = document.getElementById("quote-info");
  quoteInfo.textContent = `Quote #${quote.id} - ${quote.client.fullName}`;

  let allEmployees = await EmployeeDA.instance.getAllEmployees({
    rethrowError: false,
  });
  console.log(allEmployees);
  const employeeRows = document.getElementById("employees");
  employeeRows.innerHTML = "";
  allEmployees.forEach((employee) => {
    const employeeRow = document.createElement("tr");
    const empName = document.createElement("td");
    empName.innerText = employee.fullName;
    const empEmail = document.createElement("td");
    empEmail.innerText = employee.email;
    const addToTeam = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.className = "checkboxes";
    checkbox.type = "checkbox";
    addToTeam.appendChild(checkbox);
    employeeRow.appendChild(empName);
    employeeRow.appendChild(empEmail);
    employeeRow.appendChild(addToTeam);
    employeeRows.appendChild(employeeRow);
  });

  const saveTeamBtn = document.getElementById("save-team");
  saveTeamBtn.addEventListener("click", async () => {
    let checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    //check that atleast one member has been selected
    if (checkboxes.length >= 1) {
      console.log("save the rows");
      //get the rows
      let rows = getAllSelectedRowIndexes();
      let team = [];
      rows.forEach((row) => {
        team.push(allEmployees[row]);
      });
      let allEmployeeIds = [];
      team.forEach((employee) => {
        allEmployeeIds.push(employee.id);
      });
      quote.teamIds = allEmployeeIds;
      await QuoteDA.instance.updateQuote({
        quote: quote,
      });
      new ConfirmDialog({
        document: document,
        title: "Successful",
        message: "Team has been assigned successfully",
        buttons: ["Ok"],
        callBacks: [
          () => {
            window.location.href = `/admin home/Home(Admin).html`;
          },
        ],
      });
      console.log(allEmployeeIds);
    } else {
      alert("Please select atleast one member to assign to the team");
    }
  });

  const deselectAllBtn = document.getElementById("deselect-all");
  deselectAllBtn.addEventListener("click", deselAll);
});

function deselAll() {
  const mytable = document.getElementById("team-table");
  const ele = mytable.getElementsByTagName("input");
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].type == "checkbox") {
      ele[i].checked = false;
    }
  }
}

function getAllSelectedRowIndexes() {
  const checkboxes = document.querySelectorAll(".checkboxes");
  const selectedIndexes = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedIndexes.push(index);
    }
  });

  return selectedIndexes;
}
