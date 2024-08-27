import { UserType } from "/global/enums.js";

const allServices = JSON.parse(localStorage.getItem("allServices"));

document.addEventListener("DOMContentLoaded", () => {
  try {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    updateHomeLink(loggedInUser);

    document.getElementById("request-btn").onclick = () => {
        const selectedServiceName = document.getElementById("service").value;
        const selectedService = allServices.find(
            (service) => service.name === selectedServiceName
          );
          window.location.href =
        `/risk analysis client/RiskAnalysisClientInput.html?serviceId=${selectedService.id}`;
    };

    const serviceDropDown = document.getElementById("service");
    serviceDropDown.innerHTML = "";

    serviceDropDown.onchange = updateDescription;

    allServices.forEach((service) => {
      const option = document.createElement("option");
      option.value = service.name;
      option.textContent = service.name;
      serviceDropDown.appendChild(option);
    });
  } catch (error) {
    console.error("Error in make quote request:", error);
  }
});

function updateDescription() {
  const selectedServiceName = document.getElementById("service").value;
  const selectedService = allServices.find(
    (service) => service.name === selectedServiceName
  );
  const descriptionBox = document.getElementById("description-box");

  if (selectedService) {
    descriptionBox.innerHTML = `<p>${selectedService.description}</p>`;
  } else {
    descriptionBox.innerHTML = `<p>Select a service to see its description.</p>`;
  }
}

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
