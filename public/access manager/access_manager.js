import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import Client from "/classes/users/client.js";
import Employee from "/classes/users/employee.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.ADMIN) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", () => {
  let lc = new LoadingScreen(document);
  lc.show();

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

  const passedVar = localStorage.getItem("passedVar");
  // console.log(passedVar);
  let user = JSON.parse(passedVar);
  // console.log(user);
  if (user.userType === UserType.CLIENT) {
    user = Client.unStringify(user);
  } else if (user.userType === UserType.EMPLOYEE) {
    user = Employee.unStringify(user);
  } else {
    throw new Error("Invalid user type");
  }

  const name = document.getElementById("name");
  name.textContent = user.fullName;

  const id = document.getElementById("id");
  id.textContent = `ID: ${user.id}`;

  const userType = document.getElementById("userType");
  userType.textContent = user.userType;

  const email = document.getElementById("email");
  email.textContent = user.email;

  const phoneNo = document.getElementById("phone");
  phoneNo.textContent = user.number;

  const editAccessDropDown = document.getElementById("role");
  editAccessDropDown.innerHTML = "";

  Object.values(UserType).forEach((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.text = value.charAt(0).toUpperCase() + value.slice(1);
    editAccessDropDown.add(option);
  });

  editAccessDropDown.value = user.userType;

  const updateAccessBtn = document.getElementById("update-access-btn");
  updateAccessBtn.onclick = async () => {
    if (user.userType === editAccessDropDown.value) {
      const dialog = new ConfirmDialog({
        document: document,
        title: "Invalid Value",
        message: `The access for ${user.fullName} is already ${user.userType}.`,
        buttons: ["Ok"],
        callBacks: [() => {}],
      });
      return;
    }
    const currType =
      user.userType.charAt(0).toUpperCase() + user.userType.slice(1);
    const newUserTyper =
      editAccessDropDown.value.charAt(0).toUpperCase() +
      editAccessDropDown.value.slice(1);

    const dialog = new ConfirmDialog({
      document: document,
      title: "Update Access?",
      message: `Do you want to update the access for ${user.fullName} from ${currType} to ${newUserTyper}?`,
      buttons: ["Ok"],
      callBacks: [
        async () => {
          let lcu = new LoadingScreen(document);
          lcu.show();
          await UserDA.instance.updateUserValues({
            userId: user.id,
            data: {
              [MyUser.sUserType]: editAccessDropDown.value,
            },
          });
          lcu.hide();
        },
      ],
    });
  };

  lc.hide();
});
