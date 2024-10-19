import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.CLIENT) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let titles = [];
  let links = [];
  let addlogout = false;
  if (user && user.userType === UserType.CLIENT) {
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
      addlogout = true;
  } else {
    titles = [
      "Home",
      "Our Services",
      "About Us",
      "Contact Us",
      "FAQs",
      "Login",
    ];
    links = [
      "/index.html",
      "/view services/OurServices.html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/FAQ/FAQs.html",
      "/login/Login.html",
    ];
  }
  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: addlogout,
  });
});