document.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar");
    const availabilityTable = document.getElementById("availability-table").querySelector("tbody");
    const facilitySelect = document.getElementById("facility-select");
    const availabilitySection = document.getElementById("availability-container");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);

    //Hide the calendar and availability time 
    calendarContainer.style.display = "none";
    availabilitySection.style.display = "none";

    //Show calendar after user selected a facility
    facilitySelect.addEventListener("change", () => {
        const selectedFacility = facilitySelect.value;
        if (selectedFacility) {
            calendarContainer.style.display = "block";
            generateCalendar(currentMonth, currentYear);
            availabilitySection.style.display = "none";
        } else {
            calendarContainer.style.display = "none";
            availabilitySection.style.display = "none";
        }
    });

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        let calendarHTML = `
            <h3>${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}</h3>
            <div class="calendar-nav">
                <button id="prevMonth" ${month <= today.getMonth() && year === today.getFullYear() ? 'disabled' : ''}>◀</button>
                <button id="nextMonth" ${new Date(year, month + 1, 0) >= maxDate ? 'disabled' : ''}>▶</button>
            </div>
            <div class="calendar-grid">
        `;

        for (let i = 0; i < firstDay; i++) {
            calendarHTML += "<div class='calendar-day empty'></div>";
        }

        //Set the calendar only available for the coming 60 days
        //the days passed will not be available as well
        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(year, month, i);
            const isPast = thisDate < todayMidnight;
            const isTooFar = thisDate > maxDate;
            const disabled = isPast || isTooFar;
            const disabledClass = disabled ? "disabled" : "";
            const backgroundColor = disabled
                ? "background: #d3d3d3; color: #888;"
                : "background: white; color: black;";
            const title = isPast
                ? "Date already passed"
                : isTooFar
                ? "Booking not available beyond 60 days"
                : "Click to view availability";

            calendarHTML += `
                <div class="calendar-day ${disabledClass}" data-day="${i}" title="${title}" style="${backgroundColor}">
                    ${i}
                </div>
            `;
        }

        calendarHTML += "</div>";
        calendarContainer.innerHTML = calendarHTML;

        document.querySelector("#prevMonth")?.addEventListener("click", function () {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.querySelector("#nextMonth")?.addEventListener("click", function () {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.querySelectorAll(".calendar-day").forEach(day => {
            if (!day.classList.contains("disabled") && !day.classList.contains("empty")) {
                day.addEventListener("click", function () {
                    document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("selected"));
                    this.classList.add("selected");

                    const selectedDay = parseInt(this.getAttribute("data-day"));
                    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
                    updateAvailability(selectedDate);
                });
            }
        });
    }

    function updateAvailability(date) {
        const facility = facilitySelect.value;
        if (!facility) {
            alert("Please choose a facility first.");
            return;
        }
        
        // YYYY-MM-DD
        const formattedDate = date.toISOString().split("T")[0]; 

        const slots = [
            { time: "08:00–09:00", available: Math.floor(Math.random() * 3) + 1 },
            { time: "09:00–10:00", available: Math.floor(Math.random() * 3) + 1 },
            { time: "10:00–11:00", available: Math.floor(Math.random() * 3) + 1 },
            { time: "11:00–12:00", available: Math.floor(Math.random() * 3) + 1 },
        ];

        availabilityTable.innerHTML = "";
        slots.forEach(slot => {
            const row = `
                <tr>
                    <td>${slot.time}</td>
                    <td>${slot.available}</td>
                    <td>
                        ${slot.available > 0
                            ? `<button class='book-btn' data-time="${slot.time}" data-date="${formattedDate}" data-facility="${facility}">Book</button>`
                            : "Unavailable"}
                    </td>
                </tr>
            `;
            availabilityTable.innerHTML += row;
        });

        availabilitySection.style.display = "block";

        // If user click on book button, redirect them to new_booking
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const time = this.getAttribute('data-time');
                const date = this.getAttribute('data-date');
                const facility = this.getAttribute('data-facility');

                window.location.href = `new_booking.html?facility=${encodeURIComponent(facility)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
            });
        });
    }
});
