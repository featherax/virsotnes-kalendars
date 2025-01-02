const calendar = document.getElementById('calendar');
const eventLog = document.getElementById('event-log');
const eventContent = document.getElementById('event-content');
const backToCalendar = document.getElementById('back-to-calendar');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = `
        <div class="header">PR</div>
        <div class="header">OT</div>
        <div class="header">TR</div>
        <div class="header">CE</div>
        <div class="header">PK</div>
        <div class="header">SE</div>
        <div class="header">SV</div>
    `;

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'inactive');
        calendar.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        const dateSpan = document.createElement('span');
        dateSpan.textContent = day;
        dateSpan.classList.add('date-number');
        dayDiv.appendChild(dateSpan);

        if (
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
        ) {
            dayDiv.classList.add('today');
        }

        calendar.appendChild(dayDiv);
    }
}

function fetchEvents(month, year) {
    fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTcaQ9SI0Xtihv-83AA0e4J7kxqcZl4DZhkDN8rf9Wlvj8efL444O4qRHzuuFALCcsxuQco43tVymqa/pub?output=csv'
    )
        .then((response) => response.text())
        .then((data) => {
            const rows = data.split('\n').slice(1);
            const eventMap = {};

            rows.forEach((row) => {
                const [name, date, link, color, imageUrl, description] =
                    row.split(',');
                const eventDate = new Date(date.trim());

                if (
                    eventDate.getMonth() === month &&
                    eventDate.getFullYear() === year
                ) {
                    const day = eventDate.getDate();

                    if (!eventMap[day]) eventMap[day] = [];
                    eventMap[day].push({
                        name,
                        link,
                        color,
                        imageUrl,
                        description,
                    });

                    const dayElements = document.querySelectorAll('.day');
                    dayElements.forEach((dayEl) => {
                        const dateSpan = dayEl.querySelector('.date-number');
                        if (
                            dateSpan &&
                            parseInt(dateSpan.textContent) === day
                        ) {
                            const preview = document.createElement('div');
                            preview.classList.add('event-preview');
                            preview.innerHTML = `<span style="color: ${color};">•</span> ${name.substring(
                                0,
                                16
                            )}...`;
                            dayEl.appendChild(preview);
                            dayEl.addEventListener('click', () =>
                                showEventLog(eventMap[day], day)
                            );
                        }
                    });
                }
            });
        })
        .catch((error) => console.error('Error loading events:', error));
}

function showEventLog(events, date) {
    eventContent.innerHTML = `<h2>Events on ${date}</h2>`;
    events.forEach((event) => {
        const eventBox = document.createElement('div');
        eventBox.classList.add('event-box');
        eventBox.innerHTML = `
            <img src="${event.imageUrl.trim()}" alt="${event.name}" />
            <div class="event-details">
                <h3>${event.name}</h3>
                <p>${event.description || 'No description available.'}</p>
                <a href="${event.link.trim()}" target="_blank">View More</a>
            </div>`;
        eventContent.appendChild(eventBox);
    });
    calendar.style.display = 'none';
    eventLog.style.display = 'block';
    backToCalendar.style.display = 'inline-block';
}

backToCalendar.addEventListener('click', () => {
    eventLog.style.display = 'none';
    calendar.style.display = 'grid';
    backToCalendar.style.display = 'none';
});

generateCalendar(currentMonth, currentYear);
fetchEvents(currentMonth, currentYear);
