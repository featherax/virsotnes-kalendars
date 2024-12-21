const calendar = document.getElementById('calendar');
const popupContainer = document.getElementById('popup-container');
const popupContent = document.getElementById('popup-content');
const backToCalendar = document.getElementById('back-to-calendar');

const daysInMonth = 31;
const today = new Date().getDate();
const firstDayOffset = 6;

// Tiek pievienotas tukšās dienas
for (let i = 0; i < firstDayOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'inactive');
    calendar.appendChild(emptyDiv);
}

// Tiek pievienoti mēneša datumi
for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = `<span class="date-number">${day}</span>`;
    if (day === today) dayDiv.classList.add('today');
    calendar.appendChild(dayDiv);
}

// Datu ielāde no Google Sheets
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcaQ9SI0Xtihv-83AA0e4J7kxqcZl4DZhkDN8rf9Wlvj8efL444O4qRHzuuFALCcsxuQco43tVymqa/pub?output=csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        const eventsByDate = {};

        rows.forEach(row => {
            const [name, date, link, color, image, description] = row.split(',');
            const eventDate = new Date(date).getDate();

            if (!eventsByDate[eventDate]) eventsByDate[eventDate] = [];
            eventsByDate[eventDate].push({ name, link, color, image, description });
        });

        document.querySelectorAll('.day').forEach(dayEl => {
            const date = parseInt(dayEl.textContent);

            if (eventsByDate[date]) {
                dayEl.addEventListener('click', () => showPopup(eventsByDate[date]));
            }
        });
    });

// Funkcija pop-up loga parādīšanai
function showPopup(events) {
    popupContent.innerHTML = ''; // Tīrām vecos datus
    events.forEach(event => {
        const eventBox = document.createElement('div');
        eventBox.classList.add('event-box');

        eventBox.innerHTML = `
            <img src="${event.image || ''}" alt="Event image">
            <div class="event-details">
                <h3>${event.name}</h3>
                <p>${event.description || ''}</p>
            </div>
        `;
        popupContent.appendChild(eventBox);
    });

    popupContainer.classList.remove('hidden');
}

// Atgriešanās pie kalendāra
backToCalendar.addEventListener('click', () => {
    popupContainer.classList.add('hidden');
});
