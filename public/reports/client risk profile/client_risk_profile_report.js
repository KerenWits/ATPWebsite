import createNavBar from "/utilities/navbar.js";
import ClientDA from "/classes/users/client_da.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.ADMIN) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", async function () {
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
  const table = document.querySelector(".risk-profile-table tbody");
  lc.updateText("Preparing client risk profile...");
  // Function to clear all rows in the tbody
  function clearTable() {
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
  }

  // Function to add new data to the table
  async function addData(data) {
    for (const item of data) {
      const row = table.insertRow();
      const firstName = row.insertCell(0);
      const lastName = row.insertCell(1);
      const email = row.insertCell(2);
      const phoneNumber = row.insertCell(3);
      const riskRating = row.insertCell(4);

      const client = await ClientDA.instance.getClientByID({
        clientID: item.clientId,
      });

      firstName.textContent = client.firstName;
      lastName.textContent = client.lastName;
      email.textContent = client.email;
      phoneNumber.textContent = client.number;
      riskRating.textContent = item.riskLevel;
      riskRating.className = `${item.riskLevel.toLowerCase()}`;
    }
  }

  // Fetch data and populate the table
  async function fetchAndPopulateTable() {
    const passedVar = JSON.parse(localStorage.getItem("passedVar"));
    console.log("Passed var", passedVar);

    const startDate = new Date(passedVar[0]);
    const endDate = new Date(passedVar[1]);

    const startDateTime = document.getElementById("start-date");
    const endDateTime = document.getElementById("end-date");

    const options = { day: "numeric", month: "long", year: "numeric" };

    startDateTime.textContent = startDate.toLocaleDateString("en-GB", options);
    endDateTime.textContent = endDate.toLocaleDateString("en-GB", options);

    const riskProfile = passedVar[2];

    const highProfile = riskProfile["High-Risk"] || [];
    const mediumProfile = riskProfile["Medium-Risk"] || [];
    const lowProfile = riskProfile["Low-Risk"] || [];

    // console.log("High", highProfile);
    // console.log("Medium", mediumProfile);
    // console.log("Low", lowProfile);

    // Combine all profiles into one array
    const allProfiles = [
      ...highProfile.map((profile) => ({ ...profile, riskLevel: "High-Risk" })),
      ...mediumProfile.map((profile) => ({
        ...profile,
        riskLevel: "Medium-Risk",
      })),
      ...lowProfile.map((profile) => ({ ...profile, riskLevel: "Low-Risk" })),
    ];

    // Fetch client names and sort alphabetically within each risk group
    const sortedProfiles = await Promise.all(
      allProfiles.map(async (profile) => {
        const client = await ClientDA.instance.getClientByID({
          clientID: profile.clientId,
        });
        return { ...profile, client };
      })
    );

    sortedProfiles.sort((a, b) => {
      if (a.riskLevel === b.riskLevel) {
        return a.client.firstName.localeCompare(b.client.firstName);
      }
      if (a.riskLevel === "High-Risk") return -1;
      if (b.riskLevel === "High-Risk") return 1;
      if (a.riskLevel === "Medium-Risk") return -1;
      if (b.riskLevel === "Medium-Risk") return 1;
      return 0;
    });

    // Clear the table and add new data
    clearTable();
    await addData(sortedProfiles);
  }

  // Call the function to fetch data and populate the table
  await fetchAndPopulateTable();
  lc.hide();
});
