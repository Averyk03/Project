function Register() {
    const form = document.getElementById("registerForm");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const {
        fname, lname, DOB, email, phone,
        password, confirm_password,
        street, city, province, zip, country
    } = data;

    //Check if user full in all info or not
    if (!fname || !lname || !DOB || !email || !phone || !password || !confirm_password || !street || !city || !province || !zip || !country) {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== confirm_password) {
        alert("Passwords do not match.");
        return;
    }

    //Clean up data if register successfully
    const cleanedData = {
        fname,lname,DOB,email,phone,password,street,city,province,zip,country
    };

    //Send to backend then database
    fetch("http://localhost:5501/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cleanedData)
    })
    .then(res => res.json())
    .then(response => {
        alert(response.message);
        if (response.message === "Registration successful") {
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again later.");
    });
}
