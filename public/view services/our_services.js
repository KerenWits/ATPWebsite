import Service from "/classes/service/service.js";
import AuthService from "/auth/auth_service.js";
import ServiceDA from "/classes/service/service_da.js";
import { UserType } from "/global/enums.js";
import state from "/global/variables.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    let lc = new LoadingScreen(document);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User:", loggedInUser);
    updateHomeLink(loggedInUser);
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

function updateHomeLink(user) {
  const homeLink = document.getElementById("homeLink");
  if (!user) {
    homeLink.href = "/index.html";
  } else if (user.userType === UserType.ADMIN) {
    homeLink.href = "/admin home/Home(Admin).html";
  } else if (user.userType === UserType.CLIENT) {
    homeLink.href = "/client home/client_home.html";
  } else {
    homeLink.href = "/employee%20home/employee_home.html";
  }
}
