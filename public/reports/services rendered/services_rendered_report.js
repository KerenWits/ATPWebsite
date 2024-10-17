import createNavBar from "/utilities/navbar.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

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
  const allServices = JSON.parse(localStorage.getItem("allServices"));
  console.log("All services", allServices);
  lc.updateText("Preparing Services Rendered Report...");
  const table = document.querySelector("table tbody");
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  addData(passedVar);

  function addData(data) {
    for (const [serviceId, serviceData] of Object.entries(data)) {
      const row = table.insertRow();
      const serviceName = row.insertCell(0);
      const numberOfServices = row.insertCell(1);
      const incomeReceived = row.insertCell(2);

      const service = allServices.find((service) => service.id === serviceId);
      serviceName.textContent = service ? service.name : "Unknown Service";
      numberOfServices.textContent = serviceData.count;
      numberOfServices.style.textAlign = "center";
      incomeReceived.textContent = `R ${serviceData.amount}`;
      incomeReceived.style.textAlign = "right";
    }

    // Add the total row
    const totalRow = table.insertRow();
    totalRow.style.fontWeight = "bold";
    const totalServiceName = totalRow.insertCell(0);
    const totalNumberOfServices = totalRow.insertCell(1);
    const totalIncomeReceived = totalRow.insertCell(2);

    totalServiceName.textContent = "Total";
    totalNumberOfServices.textContent = Object.values(data).reduce(
      (sum, item) => sum + item.count,
      0
    );
    totalNumberOfServices.style.textAlign = "center";
    totalIncomeReceived.textContent = `R ${Object.values(data).reduce(
      (sum, item) => sum + item.amount,
      0
    )}`;
    totalIncomeReceived.style.textAlign = "right";
  }
  lc.hide();
});
