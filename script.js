const calendar = document.getElementById('calendar');
const eventLog = document.getElementById('event-log');
const eventContent = document.getElementById('event-content');
const backToCalendar = document.getElementById('back-to-calendar');

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
                dayEl.addEventListener('click', () => {
                    showEventLog(eventsByDate[date], date);
                });
            }
        });
    });

// Funkcija eventu loga parādīšanai
function showEventLog(events, date) {
    eventContent.innerHTML = `<h2>Notikumi ${date}. datumā</h2>`;

    events.forEach(event => {
        const eventBox = document.createElement('div');
        eventBox.classList.add('event-box');

        eventBox.innerHTML = `
            <img src="${event.image || ''}" alt="Event image">
            <div class="event-details">
                <h3>${event.name}</h3>
                <p>${event.description || ''}</p>
                <a href="${event.link}" target="_blank">Apskatīt vairāk</a>
            </div>
        `;
        eventContent.appendChild(eventBox);
    });

    calendar.style.display = 'none';
    eventLog.style.display = 'block';
}

// Atgriešanās pie kalendāra
backToCalendar.addEventListener('click', () => {
    eventLog.style.display = 'none';
    calendar.style.display = 'grid';
});
