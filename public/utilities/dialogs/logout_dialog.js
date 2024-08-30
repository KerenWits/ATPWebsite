import LoadingScreen from "/utilities/loading_screen.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import AuthService from "/auth/auth_service.js";

const logOutDialog = new ConfirmDialog({
  document: document,
  title: "Service created successfully",
  message: "Service has been created and recorded",
  buttons: ["Ok", "Cancel"],
  callBacks: [
    async () => {
      let lc = new LoadingScreen(document);
      lc.show("Logging out...");
      await AuthService.firebase().logOut();
      lc.hide();
      window.location.href = "/index.html";
    },
  ],
});

export default logOutDialog;
