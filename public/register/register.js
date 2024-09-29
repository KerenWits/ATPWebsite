import { UserType } from "/global/enums.js";
import AuthService from "/auth/auth_service.js";
import { AppAuthPramsRegister } from "/auth/provider/firebase_auth_provider.js";
import MyUser from "/classes/users/my_user.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

// Prevent spaces in email and password inputs
const emailInput = document.getElementById("email");
emailInput.addEventListener("input", function () {
  emailInput.value = emailInput.value.replace(/\s/g, "");
});
const passwordInput = document.getElementById("password");
passwordInput.addEventListener("input", function () {
  passwordInput.value = passwordInput.value.replace(/\s/g, "");
});

// Prevent spaces in name inputs
const nameInputs = ["firstname", "lastname"];
nameInputs.forEach(function (inputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.addEventListener("input", function () {
    inputElement.value = inputElement.value.replace(/\s/g, "");
  });
});

// Format phone number
const phoneInput = document.getElementById("cellphone");
phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value
    .replace(/\D/g, "") // Remove all non-digits
    .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") // Format as XXX-XXX-XXXX
    .slice(0, 12); // Limit to 12 characters
});

const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  await register();
});

async function register() {
  let lc = new LoadingScreen(document);
  lc.show();
  let email = emailInput.value;
  let password = passwordInput.value;
  let firstname = document.getElementById("firstname").value;
  let lastname = document.getElementById("lastname").value;
  let cellphone = document.getElementById("cellphone").value;
  
  lc.updateText("Signing you up...");
  let registerUser = {
    [MyUser.sEmail]: email,
    [MyUser.sPassword]: password,
    [MyUser.sFCMtoken]: "",
    [MyUser.sFirstName]: firstname,
    [MyUser.sLastName]: lastname,
    [MyUser.sNumber]: cellphone,
    [MyUser.sStatus]: MyUser.sStatusActive,
    [MyUser.sDateCreated]: new Date(),
    [MyUser.sIsVerified]: false,
    [MyUser.sUserType]: UserType.CLIENT,
  };

  let authParams = new AppAuthPramsRegister(registerUser);
  let authService = await AuthService.firebase();
  let user = await authService.register(authParams);
  lc.hide();
  const dialog = new ConfirmDialog({
    document: document,
    title: "Account created",
    message: "Your account has been created successfully",
    buttons: ["Login"],
    callBacks: [
      () => {
        window.location.href = `/login/Login.html`;
      },
    ],
  });
  console.log(user.toString());
}
