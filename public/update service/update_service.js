import createNavBar from "/utilities/navbar.js";
import ServiceDA from "/classes/service/service_da.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import MyUser from "/classes/users/my_user.js";

document.addEventListener("DOMContentLoaded", () => {
  const titles = [
    "Home",
    "Employees",
    "Services",
    "Quotes",
    "Generate report",
    "My Profile",
  ];
  const links = [
    "/admin home/Home(Admin).html",
    "/current employees/current_employees.html",
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

const allServices = await ServiceDA.instance.getAllServices({});
console.log(allServices);
const serviceDropDown = document.getElementById("service-select");
serviceDropDown.innerHTML = "";

// Create an empty option element
const emptyOption = document.createElement("option");
emptyOption.value = "";
emptyOption.textContent = "Select a service";
serviceDropDown.appendChild(emptyOption);

// Set the initial value to null
serviceDropDown.value = "";

allServices.forEach((service) => {
  const option = document.createElement("option");
  option.value = service.id;
  option.textContent = service.name;
  serviceDropDown.appendChild(option);
});

// Prevent spaces at the start of the service description
const serviceDescriptionInput = document.getElementById("service-description");
serviceDescriptionInput.addEventListener("input", function () {
  serviceDescriptionInput.value = serviceDescriptionInput.value.replace(
    /^\s+/g,
    ""
  );
});

const questionBtn = document.getElementById("question-btn");
questionBtn.onclick = (event) => {
  const selectedServiceId = serviceDropDown.value;
  const selectedService = allServices.find(
    (service) => service.id === selectedServiceId
  );
  localStorage.setItem("passedVar", JSON.stringify(selectedService));
};

serviceDropDown.onchange = () => updateDescription();

function updateDescription() {
  const selectedServiceId = serviceDropDown.value;
  if(selectedServiceId === "") {
    serviceDescriptionInput.value = "";
    return;
  }
  const selectedService = allServices.find(
    (service) => service.id === selectedServiceId
  );
  if (selectedService) {
    console.log(selectedService.description);
    serviceDescriptionInput.value = selectedService.description;
  } else {
    console.error("Selected service not found");
  }
}

document.getElementById("update-service-btn").onclick = async (event) => {
  event.preventDefault();
  const selectedServiceId = serviceDropDown.value;
  const selectedService = allServices.find(
    (service) => service.id === selectedServiceId
  );
  if (!selectedService) {
    console.error("Selected service not found");
    return;
  }

  const newDescription = serviceDescriptionInput.value;
  if (!newDescription) {
    console.error("Description cannot be empty");
    return;
  }

  const dialog = new ConfirmDialog({
    document: document,
    title: "Update?",
    message: `Update ${selectedService.name} description?`,
    buttons: ["Update", "Cancel"],
    callBacks: [
      async () => {
        let lc = new LoadingScreen(document);
        lc.show();
        // lc.hide();
        try {
          selectedService.description = newDescription;
          console.log(selectedService);
          await ServiceDA.instance.updateService({
            service: selectedService,
          });
          serviceDropDown.value = "";
          lc.hide();
          const dialog = new ConfirmDialog({
            document: document,
            title: "Success",
            message: `${selectedService.name} description updated successfully`,
            buttons: ["Ok"],
            callBacks: [() => {}],
          });
        } catch (e) {
          lc.hide();
          const dialog = new ConfirmDialog({
            document: document,
            title: "Failed",
            message: `${
              selectedService.name
            } description update failed, please try again, ${e.toString()}.`,
            buttons: ["Ok"],
            callBacks: [() => {}],
          });
        }
      },
      () => {},
    ],
  });
};
