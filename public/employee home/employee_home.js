import createNavBar from "/utilities/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  const titles = [
    "Home",
    "About us",
    "Contact us",
    "View teams",
    "My Profile",
  ];
  const links = [
    "/employee home/Home(Employee).html",
    "/about us/AboutUs.html",
    "/contact us/contactUs.html",
    "/client view team/clientViewTeam.html",
    "/profile/Profile.html",
  ];

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });
});