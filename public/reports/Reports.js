import createNavBar from "/utilities/navbar.js";
import QuoteReportsService from "/firebase/reports.js";

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

  const generateReportBtn = document.getElementById("generate-report-btn");
  generateReportBtn.addEventListener("click", async () => {
    event.preventDefault();
    const startDateTime = new Date(document.getElementById("start-date").value);
    const endDateTime = new Date(document.getElementById("end-date").value);
    const selectElement = document.getElementById("report-type");
    const selectedReportType = selectElement.value;
    // Set endDateTime to 23:59
    endDateTime.setHours(23, 59, 59, 999);

    // console.log("Start date", startDateTime);
    // console.log("End date", endDateTime);
    // console.log("Report type", selectedReportType);

    const quoteReportsService = new QuoteReportsService();

    switch (selectedReportType) {
      case "Top 10 Client Income":
        const incomeReport = await quoteReportsService.getIncomeReport(
          startDateTime,
          endDateTime
        );
        localStorage.setItem("passedVar", JSON.stringify(incomeReport));
        window.location.href = "/reports/income report/IncomeReport.html";
        // console.log("Income report", incomeReport);
        break;
      case "Services Rendered":
        const servicesRenderedReport =
          await quoteReportsService.getServicesRenderedReport(
            startDateTime,
            endDateTime
          );
        localStorage.setItem(
          "passedVar",
          JSON.stringify(servicesRenderedReport)
        );
        window.location.href = "/reports/services rendered/ServicesRenderedReport.html";
        // console.log("Services rendered report", servicesRenderedReport);
        break;
      case "Client Risk Profile":
        const clientRiskProfileReport =
          await quoteReportsService.getClientRiskProfileReport(
            startDateTime,
            endDateTime
          );
        // console.log("Client risk profile report", clientRiskProfileReport);
        localStorage.setItem(
          "passedVar",
          JSON.stringify(clientRiskProfileReport)
        );
        window.location.href = "/reports/client risk profile/clientRiskProfileReport.html";
      default:
        console.log("Invalid report type");
    }
  });
});
