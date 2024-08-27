import AuthService from "/auth/auth_service.js";
import state from "/global/variables.js";

let user = await AuthService.firebase().getCurrentUser();
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
console.log("User:", user);
console.log("local:", loggedInUser);