import createNavBar from "/utilities/navbar.js";

document.addEventListener("DOMContentLoaded", function () {
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
});