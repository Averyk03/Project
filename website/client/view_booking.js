document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    //Access Denied if user hasn't login yet
    if (!user) {
        alert("Please log in to view your bookings.");
        window.location.href = "login.html";
        return;
    }

    //Backend filters by email
    fetch(`http://localhost:5501/bookings?email=${encodeURIComponent(user.email)}`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch bookings from server.");
            return res.json();
        })
        .then(data => {
            const now = new Date();
            const upcomingTableBody = document.querySelector("#upcomingBookingsTable tbody");
            const pastTableBody = document.querySelector("#pastBookingsTable tbody");

            data.forEach(booking => {
                const dateStr = new Date(booking.date).toISOString().split("T")[0]; 
                const timeStr = booking.time.slice(0, 5); 
                const facility = formatFacilityName(booking.facility || "");
                const remark = booking.remark || "";

                const bookingDate = new Date(`${dateStr}T${timeStr}`);
                const isUpcoming = bookingDate > now;

                const row = document.createElement("tr");
                const actionHref = isUpcoming
                    ? `manage_booking.html?id=${booking.id}`
                    : `view_booking_detail.html?id=${booking.id}`;
                const actionLabel = isUpcoming ? "Manage" : "Details";

                row.innerHTML = `
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td>${facility}</td>
                    <td>${remark}</td>
                    <td><a href="${actionHref}" class="action-btn">${actionLabel}</a></td>
                `;

                if (isUpcoming) {
                    upcomingTableBody.appendChild(row);
                } else {
                    pastTableBody.appendChild(row);
                }
            });
        })
        .catch(err => {
            console.error("Error fetching bookings:", err);
        });
});

function formatFacilityName(key) {
    const map = {
        badminton: "Badminton court",
        basketabll: "Basketball court",
        futsal: "Futsal court",
        outdoor_tennis: "Outdoor Tennis court",
        pickleball: "Pickleball court",
        studio: "Studio",
        squash: "Squash court",
        volleyball: "Volleyball court"
    };
    return map[key] || key;
}
