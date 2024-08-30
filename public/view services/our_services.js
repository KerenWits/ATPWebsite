import Service from "/classes/service/service.js";
import AuthService from "/auth/auth_service.js";
import ServiceDA from "/classes/service/service_da.js";
import { UserType } from "/global/enums.js";
import state from "/global/variables.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import createNavBar from "/utilities/navbar.js";



document.addEventListener("DOMContentLoaded", async () => {
  try {
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

    let lc = new LoadingScreen(document);
    lc.show();
    let allServices = await ServiceDA.instance.getAllServices({});
    lc.updateText("Getting services...");

    // Get the Service-blocks container
    const serviceBlocksContainer = document.querySelector(".Service-blocks");

    // Clear any existing service blocks
    serviceBlocksContainer.innerHTML = "";

    // Iterate over the services and create HTML elements for each service
    allServices.forEach((service) => {
      const serviceBlock = document.createElement("div");
      serviceBlock.classList.add("Service-block");

      const serviceTitle = document.createElement("h2");
      serviceTitle.textContent = service.name;
      serviceBlock.appendChild(serviceTitle);

      const serviceDescription = document.createElement("p");
      serviceDescription.textContent = service.description;
      serviceBlock.appendChild(serviceDescription);

      if (loggedInUser) {
        const requestQuoteBtn = document.createElement("a");
        requestQuoteBtn.href = "/quotes/Quotes.html";
        requestQuoteBtn.classList.add("RequestQuoteBtn");
        requestQuoteBtn.textContent = "Request a quote";
        serviceBlock.appendChild(requestQuoteBtn);
      }

      // Append the service block to the container
      serviceBlocksContainer.appendChild(serviceBlock);
      lc.updateText("Services received...");
    });
    lc.hide();
  } catch (error) {
    console.error("Error fetching services:", error);
  }
});


