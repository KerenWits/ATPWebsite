import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let titles = [];
  let links = [];
  if (user.userType === UserType.CLIENT) {
    titles = [
      "Home",
      "Our Services",
      "About us",
      "Contact us",
      "FAQs",
      "Quotes",
      "My Profile",
    ];
    links = [
      "/client home/client_home.html",
      "/view services/OurServices.html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/FAQ/FAQs.html",
      "/quotes/Quotes.html",
      "/profile/Profile.html",
    ];
  } else if (user.userType === UserType.EMPLOYEE) {
    titles = [ "Home",
      "About us",
      "Contact us",
      "View teams",
      "My Profile",];
    links = [ "/employee home/Home(Employee).html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/client view team/clientViewTeam.html",
      "/profile/Profile.html",];
  }
  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });
});