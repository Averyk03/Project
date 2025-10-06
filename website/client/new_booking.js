document.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("user");

    //Access Denied if user hasn't login yet
    if (!userData) {
        alert("You must be logged in to make a booking.");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userData);
    const form = document.getElementById("bookingform");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const facility_type = document.getElementById("type").value;
        const booking_date = document.getElementById("date").value;
        const booking_time = document.getElementById("time").value;
        const duration = document.getElementById("duration").value;
        const remark = document.getElementById("remark").value;

        fetch("http://localhost:5501/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_email: user.email,facility_type,booking_date,booking_time,duration,remark
            })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.message === "Booking successful!") {
                form.reset();
            }
        })
        .catch(err => {
            console.error("Booking failed:", err);
            alert("Something went wrong. Please try again.");
        });
    });
});
