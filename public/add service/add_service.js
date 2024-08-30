import Service from "/classes/service/service.js";
import ServiceDA from "/classes/service/service_da.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";

// Prevent spaces at the start of the service name
const serviceNameInput = document.getElementById("service-name");
serviceNameInput.addEventListener("input", function () {
  serviceNameInput.value = serviceNameInput.value.replace(/^\s+/g, "");
});

// Handle form submission
const addServiceForm = document.getElementById("add-service-form");
addServiceForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  await addService();
});

async function addService() {
  const serviceNameInput = document.getElementById("service-name");
  const serviceDescriptionInput = document.getElementById(
    "service-description"
  );

  let serviceName = serviceNameInput.value;
  let serviceDescription = serviceDescriptionInput.value;

  let service = new Service({
    id: "",
    name: serviceName,
    description: serviceDescription,
    status: Service.sStatusInComplete,
  });
  let newService = await ServiceDA.instance.createService({ service: service });

  if (newService) {
    console.log("Service created successfully");
    const dialog = new ConfirmDialog({
      document: document,
      title: "Service created successfully",
      message: "Service has been created and recorded",
      buttons: ["Ok"],
      callBacks: [
        () => {
          window.location.href = `/risk analysis question/AddRiskAnalysisQuestions.html?serviceId=${newService.id}`;
        },
      ],
    });
  }
  //   console.log(newService.toString());
}
