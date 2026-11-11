
// ========================================
// YUVAJANA SAKHYAM - WEBSITE FUNCTIONALITY
// FRONTEND DEMONSTRATION VERSION
// ========================================


// 1. SAMPLE WEBSITE DATA

let events = JSON.parse(localStorage.getItem("ys_events")) || [
   
    {
        id: 1,
        name: "Youth Fellowship",
        date: "2026-12-05",
        venue: "Church Hall",
        description: "A time of fellowship, worship and learning.",

        openingDate: "2026-11-15T09:00",
        closingDate: "2026-12-03T23:59"
    },

    {
        id: 2,
        name: "Christmas Celebration",
        date: "2026-12-20",
        venue: "Church Auditorium",
        description: "Join us for our Christmas celebrations.",

        openingDate: "2026-11-20T09:00",
        closingDate: "2026-12-15T23:59"
    }
];

let announcements =
    JSON.parse(localStorage.getItem("ys_announcements")) || [
        {
            title: "Welcome to Parackathanam Yuvajana Sakhyam",
            message: "Visit our portal for upcoming programmes and updates."
        }
    ];

let registrations =
    JSON.parse(localStorage.getItem("ys_registrations")) || [];


// 2. SAVE DATA IN BROWSER STORAGE

function saveData() {

    localStorage.setItem("ys_events", JSON.stringify(events));

    localStorage.setItem(
        "ys_announcements",
        JSON.stringify(announcements)
    );

    localStorage.setItem(
        "ys_registrations",
        JSON.stringify(registrations)
    );

}


// 3. DISPLAY EVENTS


// DISPLAY EVENTS WITH MINI CALENDAR

function displayEvents() {

    const container = document.getElementById("eventContainer");

    container.innerHTML = "";

    events.forEach(event => {

        const now = new Date();

        const opening = new Date(event.openingDate);
        const closing = new Date(event.closingDate);

        let status;
        let statusClass;
        let countdown;
        let canRegister = false;

        if (now < opening) {

            status = "Registration Upcoming";
            statusClass = "status-upcoming";

            countdown = "Opens: " +
                opening.toLocaleString();

        }

        else if (now >= opening && now <= closing) {

            status = "Registration Open";
            statusClass = "status-open";

            countdown = "Closes: " +
                closing.toLocaleString();

            canRegister = true;

        }

        else {

            status = "Registration Closed";
            statusClass = "status-closed";

            countdown = "Registration period has ended.";

        }


        const card = document.createElement("div");

        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = event.name;

        const eventDate = document.createElement("p");
        eventDate.textContent =
            "Event Date: " + event.date;

        const venue = document.createElement("p");
        venue.textContent =
            "Venue: " + event.venue;

        const description = document.createElement("p");
        description.textContent = event.description;

        // MINI CALENDAR

        const calendar = document.createElement("div");

        calendar.className = "event-calendar";

        const calendarHeading = document.createElement("div");

        calendarHeading.className = "calendar-heading";

        calendarHeading.textContent = "📅 Registration Calendar";

        const openingRow = document.createElement("div");

        openingRow.className = "calendar-date";

        openingRow.innerHTML =
            "<span>Opening Date</span><strong></strong>";

        openingRow.querySelector("strong").textContent =
            opening.toLocaleString();

        const closingRow = document.createElement("div");

        closingRow.className = "calendar-date";

        closingRow.innerHTML =
            "<span>Closing Date</span><strong></strong>";

        closingRow.querySelector("strong").textContent =
            closing.toLocaleString();

        calendar.append(
            calendarHeading,
            openingRow,
            closingRow
        );

        // REGISTRATION STATUS

        const statusBadge = document.createElement("span");

        statusBadge.className =
            "registration-status " + statusClass;

        statusBadge.textContent = status;

        // COUNTDOWN

        const timer = document.createElement("p");

        timer.className = "registration-countdown";

        timer.textContent = countdown;

        // REGISTER BUTTON

        const button = document.createElement("button");

        button.className =
            "primary-btn event-register-btn";

        button.textContent =
            canRegister ? "Register Now" :
            now < opening ? "Registration Not Open" :
            "Registration Closed";

        button.disabled = !canRegister;

        button.addEventListener("click", () => {

            openRegistration(event.id);

        });

        card.append(
            title,
            eventDate,
            venue,
            description,
            calendar,
            statusBadge,
            timer,
            button
        );

        container.appendChild(card);

    });

}


// 4. EVENT REGISTRATION

let selectedEventId = null;

function openRegistration(id) {

    const event = events.find(item => item.id === id);

    if (!event) return;

    selectedEventId = id;

    document.getElementById("selectedEvent").textContent =
        "Selected event: " + event.name;

    document.getElementById("registrationModal").style.display = "block";

}


function closeRegistration() {

    document.getElementById("registrationModal").style.display = "none";

}


document.getElementById("registrationForm").addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const age = Number(document.getElementById("regAge").value);
        const email = document.getElementById("regEmail").value.trim();
        const parish = document.getElementById("regParish").value.trim();
        const consent = document.getElementById("regConsent").checked;

        if (!name || !email || !consent ||
            !Number.isInteger(age) || age < 1 || age > 100) {

            alert("Please check the information you entered.");
            return;

        }

        const event = events.find(item => item.id === selectedEventId);

        if (!event) {
            alert("This event is no longer available.");
            return;
        }

        const registration = {
            id: Date.now(),
            name: name,
            age: age,
            email: email,
            phone: phone,
            event: event.name
        };

        registrations.push(registration);

        saveData();

        alert("Registration saved in this browser!");

        this.reset();

        closeRegistration();

        updateDashboard();

    }
);


// 5. DISPLAY ANNOUNCEMENTS

function displayAnnouncements() {

    const container =
        document.getElementById("announcementContainer");

    container.innerHTML = "";

    announcements.forEach(item => {

        const card = document.createElement("div");

        card.className = "announcement-card";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        const message = document.createElement("p");
        message.textContent = item.message;

        card.append(heading, message);

        container.appendChild(card);

    });

}


// 6. ADD A NEW EVENT THROUGH ADMIN DASHBOARD

document.getElementById("eventForm").addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const newEvent = {

            id: Date.now(),

            name: document.getElementById("eventName").value.trim(),

            date: document.getElementById("eventDate").value,

            venue: document.getElementById("eventVenue").value.trim(),

            description:
                document.getElementById("eventDescription").value.trim()

        };

        events.push(newEvent);

        saveData();

        displayEvents();

        updateDashboard();

        this.reset();

        alert("New event added!");

    }
);


// 7. ADD ANNOUNCEMENT

document.getElementById("announcementForm").addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const newAnnouncement = {

            title: document.getElementById("announcementTitle").value.trim(),

            message:
                document.getElementById("announcementText").value.trim()

        };

        announcements.unshift(newAnnouncement);

        saveData();

        displayAnnouncements();

        updateDashboard();

        this.reset();

        alert("Announcement published!");

    }
);


// 8. ADMIN DASHBOARD

function openAdmin() {

    const panel = document.getElementById("adminPanel");

    panel.style.display = "block";

    updateDashboard();

    panel.scrollIntoView({ behavior: "smooth" });

}


function closeAdmin() {

    document.getElementById("adminPanel").style.display = "none";

}


function updateDashboard() {

    document.getElementById("eventCount").textContent =
        events.length;

    document.getElementById("registrationCount").textContent =
        registrations.length;

    document.getElementById("announcementCount").textContent =
        announcements.length;

    const container =
        document.getElementById("registrationRecords");

    container.innerHTML = "";

    if (registrations.length === 0) {

        container.textContent = "No registrations yet.";

        return;

    }

    registrations.forEach(item => {

        const record = document.createElement("div");

        record.className = "record";

        const details = document.createElement("p");

        details.textContent =
            item.name + " | " + item.event + " | " + item.email;

        record.appendChild(details);

        container.appendChild(record);

    });

}


// 9. LANGUAGE SWITCHING

let currentLanguage = "en";

function toggleLanguage() {

    currentLanguage =
        currentLanguage === "en" ? "ml" : "en";

    document.querySelectorAll("[data-en]").forEach(element => {

        element.textContent =
            element.getAttribute("data-" + currentLanguage);

    });

    document.getElementById("languageBtn").textContent =
        currentLanguage === "en" ? "മലയാളം" : "English";

}


// 10. INITIALISE WEBSITE

displayEvents();

displayAnnouncements();

updateDashboard();

console.log("Yuvajana Sakhyam portal loaded successfully!");
