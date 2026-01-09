//If the user login, the login button change to logout button in the navbar
//If user not login yet, it will show login in the navbar
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl && user) {
        welcomeEl.innerText = `Welcome, ${user.email}`;
    }

    const authLink = document.getElementById("authLink");
    if (authLink) {
        if (user) {
            authLink.textContent = "Logout";
            authLink.href = "#";
            authLink.addEventListener("click", () => {
                localStorage.removeItem("user");
                window.location.href = "login.html";
            });
        } else {
            authLink.textContent = "Login";
            authLink.href = "login.html";
        }
    }
});
