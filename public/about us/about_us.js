import createNavBar from "/utilities/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
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
});
