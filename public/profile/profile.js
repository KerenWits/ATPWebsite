import createNavBar from "/utilities/navbar.js";
import { UserType } from "/global/enums.js";

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
