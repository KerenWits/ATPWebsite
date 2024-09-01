import createNavBar from "/utilities/navbar.js";
import ClientDA from "/classes/users/client_da.js";

document.addEventListener("DOMContentLoaded", async function () {
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

  const table = document.querySelector(".risk-profile-table tbody");

  // Function to clear all rows in the tbody
  function clearTable() {
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
  }

  // Function to add new data to the table
  function addData(data) {
    data.forEach((item) => {
      const row = table.insertRow();
      const firstName = row.insertCell(0);
      const lastName = row.insertCell(1);
      const email = row.insertCell(2);
      const phoneNumber = row.insertCell(3);
      const riskRating = row.insertCell(4);

      firstName.textContent = item[0].firstName;
      lastName.textContent = item[0].lastName;
      email.textContent = item[0].email;
      phoneNumber.textContent = item[0].number;
      riskRating.textContent = item[2];
      riskRating.className = `${item[2].toLowerCase()}`;
    });
  }

  // Fetch data and populate the table
  const passedVar = JSON.parse(localStorage.getItem("passedVar"));
  console.log("Passed var", passedVar);
  const profileInfo = [];

  for (const element of passedVar) {
    const clientID = element.clientId;
    const averageRisk = element.averageRisk;
    const riskLevel = element.riskLevel;
    const client = await ClientDA.instance.getClientByID({
      clientID: clientID,
    });
    profileInfo.push([client, averageRisk, riskLevel]);
  }

  // Clear the table and add new data
  clearTable();
  addData(profileInfo);
});
