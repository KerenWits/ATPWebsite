import createNavBar from "/utilities/navbar.js";
import AuthService from "/auth/auth_service.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  let user = await AuthService.firebase().getCurrentUser();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("User:", user);
  console.log("local:", loggedInUser);
});