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
    titles = ["Home", "My Profile"];
    links = ["/client home/client_home.html", "/profile/Profile.html"];
  }

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });

  const loggedInUser = UserDA.instance.unstringifyUser(user);
  console.log(loggedInUser);

  const name = document.getElementById("name");
  const id = document.getElementById("id");
  const type = document.getElementById("type");
  const status = document.getElementById("status");

  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  name.textContent = loggedInUser.fullName;
  id.textContent = loggedInUser.id;
  type.textContent = loggedInUser.userType.toUpperCase();
  status.textContent = loggedInUser.status.toUpperCase();
  email.textContent = loggedInUser.email;
  phone.textContent = loggedInUser.phoneNumber ?? "N/A";

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

  const updateBtn = document.getElementById("update-button");
  updateBtn.addEventListener("click", () => {
    window.location.href("/update profile/UpdateProfile.html");
  });
});

// function updateDetails(){
//     //can only change name and contact info?
//     //change in db?
// }

// //popup logic
// document.addEventListener('DOMContentLoaded', () => {
//     const popup = document.getElementById('popup');
//     const deactivateBtn = document.getElementById('deactivate-button');
//     const closePopupBtn = document.getElementById('closePopupBtn');
//     const confirmDeactivation = document.getElementById('confirmDeactivation');
//     const logicResult = document.getElementById('logicResult');
//     //so you can change the message and reuse the popup for other things
//     const message = document.getElementById('message');

//     // Open the popup
//     deactivateBtn.addEventListener('click', () => {
//         popup.style.display = 'flex';
//     });

//     // Close the popup
//     closePopupBtn.addEventListener('click', () => {
//         popup.style.display = 'none';
//     });

//     // Logic for the button inside the popup
//     confirmDeactivation.addEventListener('click', () => {
//         //logicResult.textContent = "Account Deleted."
//         alert("Account Deleted.");
//         //take to login
//         //replace so they cant go back
//         window.location.replace("Login.html");

//     });

//     // Close the popup when clicking outside of the content
//     window.addEventListener('click', (event) => {
//         if (event.target === popup) {
//             popup.style.display = 'none';
//         }
//     });
// });
