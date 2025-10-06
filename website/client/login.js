document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginform");

  form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
          const response = await fetch("http://localhost:5501/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.ok) {
              localStorage.setItem("user", JSON.stringify(data.user));
              alert("Login successful!");
              window.location.href = "main.html";
          } else {
              alert(data.message || "Invalid email or password.");
          }
      } catch (error) {
          console.error("Error:", error);
          alert("Something went wrong. Please try again.");
      }
  });
});
