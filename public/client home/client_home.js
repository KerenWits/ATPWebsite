import AuthService from "/auth/auth_service.js";

document.addEventListener('DOMContentLoaded', async () => {
    let user = await AuthService.firebase().getCurrentUser();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log("User:", user);
    console.log("local:", loggedInUser);
});