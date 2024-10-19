import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import EmployeeDA from "/classes/users/employee_da.js";
import ClientDA from "/classes/users/client_da.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.ADMIN) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}
document.addEventListener("DOMContentLoaded", async () => {
  let lc = new LoadingScreen(document);
  lc.show();

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

  const allEmployees = await EmployeeDA.instance.getAllEmployees({});
  const allClients = await ClientDA.instance.getAllClients({});

  const employeeTableBody = document.getElementById("employees");
  employeeTableBody.innerHTML = "";
  const clientTableBody = document.getElementById("clients");
  clientTableBody.innerHTML = "";

  allEmployees.forEach((employee) => {
    let row = employeeTableBody.insertRow();
    row.insertCell().innerText = employee.fullName;
    row.insertCell().innerText = employee.email;
    row.insertCell().innerText = employee.userType;
    const accessBtn = document.createElement("button");
    accessBtn.className = "button";
    accessBtn.innerText = "Manage access";
    accessBtn.onclick = () => {
      const dialog = new ConfirmDialog({
        document: document,
        title: "Update Access?",
        message: `Do you want to update the access for ${employee.fullName}?`,
        buttons: ["Ok"],
        callBacks: [
          () => {
            localStorage.setItem("passedVar", JSON.stringify(employee));
            window.location.href = `/access manager/access_manager.html`;
          },
        ],
      });
    };
    row.insertCell().appendChild(accessBtn);
  });

  allClients.forEach((client) => {
    let row = clientTableBody.insertRow();
    row.insertCell().innerText = client.fullName;
    row.insertCell().innerText = client.email;
    const accessBtn = document.createElement("button");
    accessBtn.className = "button";
    accessBtn.innerText = "Manage access";
    accessBtn.onclick = () => {
      const dialog = new ConfirmDialog({
        document: document,
        title: "Update Access?",
        message: `Do you want to update the access for ${client.fullName}?`,
        buttons: ["Ok"],
        callBacks: [
          () => {
            localStorage.setItem("passedVar", JSON.stringify(client));
            window.location.href = `/access manager/access_manager.html`;
          },
        ],
      });
    };
    row.insertCell().appendChild(accessBtn);
  });

  lc.hide();
});
