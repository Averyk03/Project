document.addEventListener("DOMContentLoaded", () => {
    console.log("contact.js loaded");

    const form = document.getElementById("contactform");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        console.log("Contact form submitted");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        console.log("Sending:", { name, email, phone, message });

        fetch("http://localhost:5501/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, phone, message })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Server response:", data);
            alert(data.message);
            form.reset();
        })
        .catch(err => {
            console.error("Error sending contact form:", err);
            alert("Something went wrong. Please try again.");
        });
    });
});
