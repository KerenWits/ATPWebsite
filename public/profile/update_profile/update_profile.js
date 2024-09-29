import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import MyUser from "/classes/users/my_user.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let titles = [];
  let links = [];
  if (user.userType === UserType.ADMIN) {
    titles = ["Home", "Services", "Quotes", "Generate report", "My Profile"];
    links = [
      "/admin home/Home(Admin).html",
      "/services admin/ServicesAdmin.html",
      "/quotes/admin/Quotes(Admin).html",
      "/reports/Reports.html",
      "/profile/Profile.html",
    ];
  } else if (user.userType === UserType.CLIENT) {
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
    titles = ["Home", "About us", "Contact us", "View teams", "My Profile"];
    links = [
      "/employee home/Home(Employee).html",
      "/about us/AboutUs.html",
      "/contact us/contactUs.html",
      "/client view team/clientViewTeam.html",
      "/profile/Profile.html",
    ];
  }

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });

  const loggedInUser = UserDA.instance.unstringifyUser(user);
  console.log(loggedInUser);

  const firstname = document.getElementById("first_name");
  const lastname = document.getElementById("last_name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");

  firstname.value = loggedInUser.firstName;
  lastname.value = loggedInUser.lastName;
  email.value = loggedInUser.email;
  phone.value = loggedInUser.number;
  password.value = "";

  const deactivateBtn = document.getElementById("deactivate-button");
  deactivateBtn.addEventListener("click", () => {
    const dialog = new ConfirmDialog({
      document: document,
      title: "Deactive account?",
      message: `Are you sure you wish to deactivate your account? 
      This action cannot be undone. 
      If you wish to use our service again you will need to re-register.`,
      buttons: ["Deactivate", "Cancel"],
      callBacks: [
        async () => {
          let lc = new LoadingScreen(document);
          lc.show("Deactivating account...");
          // lc.hide();
          try {
            loggedInUser.status = MyUser.sStatusInactive;
            console.log(loggedInUser);
            await UserDA.instance.updateUser({
              user: loggedInUser,
            });
            lc.hide();
            const dialog = new ConfirmDialog({
              document: document,
              title: "Success",
              message: `Account deactivated successfully.`,
              buttons: ["Ok"],
              callBacks: [
                () => {
                  localStorage.clear();
                  window.location.replace("/index.html");
                },
              ],
            });
          } catch (e) {
            lc.hide();
            const dialog = new ConfirmDialog({
              document: document,
              title: "Failed",
              message: `Account deactivation failed, please try again, ${e.toString()}.`,
              buttons: ["Ok"],
              callBacks: [() => {}],
            });
          }
        },
        () => {},
      ],
    });
  });

//   const updateBtn = document.getElementById("update-button");
//   updateBtn.addEventListener("click", async () => {
//     let loggedInUser = UserDA.instance.unstringifyUser(
//       JSON.parse(localStorage.getItem("loggedInUser"))
//     );
//     const firstName = document.getElementById("first_name").value;
//     const lastName = document.getElementById("last_name").value;
//     const email = document.getElementById("email").value;
//     const phone = document.getElementById("phone").value;
//     const password = document.getElementById("password").value;

//     loggedInUser.firstName = firstName;
//     loggedInUser.lastName = lastName;
//     loggedInUser.email = email;
//     loggedInUser.number = phone;

//     if (password) {
//       loggedInUser.password = password;
//     }
//     try {
//       let lc = new LoadingScreen(document);
//       lc.show("Updating user...");

//       await UserDA.instance.updateUser({ user: loggedInUser });

//       localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

//       lc.hide();
//       new ConfirmDialog({
//         document: document,
//         title: "Update Successful",
//         message: "Your profile has been updated successfully.",
//         buttons: ["OK"],
//         callBacks: [() => {window.location.href= "/profile/Profile.html"}],
//       });
//     } catch (error) {
//       lc.hide();
//       new ConfirmDialog({
//         document: document,
//         title: "Update Failed",
//         message: "Failed to update profile: " + error.message,
//         buttons: ["OK"],
//         callBacks: [() => {}],
//       });
//     }
//   });
});

// Format phone number
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value
    .replace(/\D/g, "") // Remove all non-digits
    .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") // Format as XXX-XXX-XXXX
    .slice(0, 12); // Limit to 12 characters
});
