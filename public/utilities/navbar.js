import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import AuthService from "/auth/auth_service.js";

function createNavBar({ document, titles, links, addLogout = false }) {
  console.log("createNavBar called");
  const header = document.createElement("header");
  const nav = document.createElement("nav");
  nav.className = "Navbar";
  const ul = document.createElement("ul");

  if (titles.length !== links.length) {
    console.error("Titles and links must have the same length");
    return;
  }

  // Add logo
  const logo = document.createElement("li");
  logo.className = "logo";
  const img = document.createElement("img");
  img.src =
    "https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=";
  logo.appendChild(img);
  ul.appendChild(logo);

  // Add navigation links
  for (let i = 0; i < titles.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = titles[i];
    a.href = links[i];
    li.appendChild(a);
    ul.appendChild(li);
  }

  // Add logout button if required
  if (addLogout) {
    const logoutLi = document.createElement("li");
    const logOutButton = document.createElement("a");
    logOutButton.textContent = "Log Out";
    logOutButton.addEventListener("click", async () => {
      new ConfirmDialog({
        document: document,
        title: "Confirm Logout",
        message: "Are you sure you want to log out?",
        buttons: ["Ok", "Cancel"],
        callBacks: [
          async () => {
            let lc = new LoadingScreen(document);
            lc.show("Logging out...");
            await AuthService.firebase().logOut();
            lc.hide();
            window.location.href = "/index.html";
          },
          () => {},
        ],
      });
    });
    logoutLi.appendChild(logOutButton);
    ul.appendChild(logoutLi);
  }

  nav.appendChild(ul);
  header.appendChild(nav);
  document.body.insertBefore(header, document.body.firstChild);
  console.log("Navbar added to the document");
}

export default createNavBar;
