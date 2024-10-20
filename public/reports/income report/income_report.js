import createNavBar from "/utilities/navbar.js";
import ClientDA from "/classes/users/client_da.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.ADMIN) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", function () {
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
  let lc = new LoadingScreen(document);
  lc.show();
  const passedVar = JSON.parse(localStorage.getItem("passedVar"));
  console.log("Passed var", passedVar);
  lc.updateText("Preparing Income Report...");
  const clientInfo = [];
  const startDate = new Date(passedVar[0]);
  const endDate = new Date(passedVar[1]);
  const topClients = passedVar[2];

  const startDateTime = document.getElementById("start-date");
  const endDateTime = document.getElementById("end-date");

  const options = { day: "numeric", month: "long", year: "numeric" };

  startDateTime.textContent = startDate.toLocaleDateString("en-GB", options);
  endDateTime.textContent = endDate.toLocaleDateString("en-GB", options);

  (async () => {
    for (const element of topClients) {
      const clientID = element[0];
      const clientAmt = element[1];
      const client = await ClientDA.instance.getClientByID({
        clientID: clientID,
      });
      clientInfo.push([client, clientAmt]);
    }
    console.log("Client info", clientInfo);
    populateClientTable(clientInfo);
  })();

  function populateClientTable(clientInfo) {
    const table = document.getElementById("clients-table");

    // Clear existing rows except for the header
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    let grandTotal = 0;

    // Populate the table with new data
    clientInfo.forEach((element) => {
      const row = table.insertRow();
      const firstName = row.insertCell(0);
      const lastName = row.insertCell(1);
      const email = row.insertCell(2);
      const amount = row.insertCell(3);
      firstName.innerHTML = element[0].firstName;
      lastName.innerHTML = element[0].lastName;
      email.innerHTML = element[0].email;
      amount.innerHTML = `R ${element[1]}`;
      grandTotal += element[1];
    });

    const footer = table.createTFoot();
    const footerRow = footer.insertRow();
    const footerCell1 = footerRow.insertCell(0);
    const footerCell2 = footerRow.insertCell(1);
    footerCell1.colSpan = 3;
    footerCell1.innerHTML = "Grand Total";
    footerCell2.innerHTML = `R ${grandTotal}`;
    lc.hide();

    // Update the grand total value
    // const grandTotalRow = document.querySelector("tfoot");
    // console.log("Tfoot innerHTML: ", grandTotalRow.innerHTML);
    // console.log(document.querySelector("tfoot"));
    // console.log(document.querySelector("tfoot tr#grand-total"));
    // console.log(document.querySelector("tfoot tr#grand-total td:last-child"));
    // console.log(document.getElementById("grand-total-amt"));

    // if (grandTotalRow) {
    //   grandTotalRow.innerHTML = `R ${grandTotal}`;
    // } else {

    // }
  }
});
