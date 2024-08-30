import { UserType } from "/global/enums.js";

function updateHomeLink(document, user) {
  const homeLink = document.getElementById("homeLink");
  if (!user) {
    homeLink.href = "/index.html";
  } else if (user.userType === UserType.ADMIN) {
    homeLink.href = "/admin home/Home(Admin).html";
  } else if (user.userType === UserType.CLIENT) {
    homeLink.href = "/client home/client_home.html";
  } else {
    homeLink.href = "/employee%20home/employee_home.html";
  }
}

export default updateHomeLink;