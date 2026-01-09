document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Show welcome message to user when they just logged in
    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl && user) {
        welcomeEl.innerText = `Welcome, ${user.email}`;
    }

    //If the user login, the login button change to logout button in the navbar
    //If user not login yet, it will show login in the navbar
    const authLink = document.getElementById("authLink");
    if (authLink) {
        if (user) {
            authLink.textContent = "Logout";
            authLink.href = "#";
            authLink.addEventListener("click", (e) => {
                e.preventDefault(); // prevent default anchor behavior
                localStorage.removeItem("user");
                alert("You have been logged out.");
                window.location.href = "login.html";
            });
        } else {
            authLink.textContent = "Login";
            authLink.href = "login.html";
        }
    }
});
