import AuthService from "/auth/auth_service.js";
import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.CLIENT) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}
document.addEventListener("DOMContentLoaded", async () => {
  const titles = [
    "Home",
    "Our Services",
    "About us",
    "Contact us",
    "FAQs",
    "Quotes",
    "My Profile",
  ];
  const links = [
    "/client home/client_home.html",
    "/view services/OurServices.html",
    "/about us/AboutUs.html",
    "/contact us/contactUs.html",
    "/FAQ/FAQs.html",
    "/quotes/Quotes.html",
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