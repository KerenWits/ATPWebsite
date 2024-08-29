import AuthService from "/auth/auth_service.js";
import { AppAuthPramsLogin } from "/auth/provider/firebase_auth_provider.js";
import { UserType } from "/global/enums.js";
import UserDA from "/classes/users/userDA.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

// Prevent spaces in email input
const emailInput = document.querySelector("#email");
emailInput.addEventListener("input", function () {
  emailInput.value = emailInput.value.replace(/\s/g, "");
});

// Prevent spaces in password input
const passwordInput = document.querySelector("#password");
passwordInput.addEventListener("input", function () {
  passwordInput.value = passwordInput.value.replace(/\s/g, "");
});

// Handle form submission
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  await login();
});

async function login() {
  let lc = new LoadingScreen(document);
  lc.show();
  let email = emailInput.value;
  let password = passwordInput.value;

  let loginParams = new AppAuthPramsLogin(email, password);
  let authService = AuthService.firebase();

  let user = await authService.logIn(loginParams);
  lc.updateText("Logging in...");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("local user login:", loggedInUser);
  lc.updateText("Getting user data...");
  await UserDA.instance.getAllUserDataGlobally({ user: user });

  lc.hide();

  if (user.userType === UserType.ADMIN) {
    // // console.log("admin state: ",user.toString());
    window.location.href = "/admin home/Home(Admin).html";
  } else if (user.userType === UserType.CLIENT) {
    // console.log("cleint state: ", user.toString());
    window.location.href = "/client home/client_home.html";
  }
}

// Login function
// async function login(email, password) {
// console.log("Email:", email);
// console.log("Password:", password);
// console.log(client.toString());
// const fs = new FirestoreService("services");

// create
// let q1 = new Question({ questionTxt: "question 1", range: [1, 2, 3, 4, 5], values: ["a", "b", "c", "d", "e"] });
// let q2 = new Question({ questionTxt: "question 2", range: ["yes", "no"], values: ["happy", "sad"] });
// service = new Service({ id:"", name: "eviction", description: "my desscription", riskAnalysis: [q1, q2] });
// await fs.createDocument({ data: service.toJson(), rethrowError: false });
// console.log(service.toString());

// get all dervices
// let querySnapshot = await fs.getDocuments({
//   where: [[Service.sName], "isEqualTo", "eviction"],
//   rethrowError: false,
// });
// for (let doc of querySnapshot.docs) {
//   let newService = Service.fromJson({ docID: doc.id, json: doc.data() });
//   console.log(newService.toString());
// }

// read
// let docSnap = await fs.readDocument({ docID: "fz2ZUyFwu14VYF3J8sMk", rethrowError: false });
// service = Service.fromJson({ docID: docSnap.id, json: docSnap.data() });
// console.log(service.toString());
// console.log(service.riskAnalysis[0].toString());

// update
// let docSnap = await fs.getNewUpdatedDocument({
//   docID: "fz2ZUyFwu14VYF3J8sMk",
//   data: { [Service.sName]: "security escort" },
//   rethrowError: false
// });
// service = Service.fromJson({ docID: docSnap.id, json: docSnap.data() });
// console.log(service.toString());
// console.log(service.riskAnalysis[0].toString());

// delete
// let docSnap = await fs.deleteDocument({
//   docID: "fz2ZUyFwu14VYF3J8sMk",
//   rethrowError: false
// });
// console.log("deleted doc");

//   lc.close();
// }
