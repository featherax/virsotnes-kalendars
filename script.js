// script.js
const calendar = document.getElementById('calendar');
const eventLog = document.getElementById('event-log');
const eventContent = document.getElementById('event-content');
const backToCalendar = document.getElementById('back-to-calendar');

const daysInMonth = 31;
const today = new Date().getDate();
const firstDayOffset = 6;

// Add blank days for offset
for (let i = 0; i < firstDayOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'inactive');
    calendar.appendChild(emptyDiv);
}

// Generate days with events
for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    const dateSpan = document.createElement('span');
    dateSpan.textContent = day;
    dateSpan.classList.add('date-number');
    dayDiv.appendChild(dateSpan);
    if (day === today) dayDiv.classList.add('today');
    calendar.appendChild(dayDiv);
}

// Fetch data from Google Sheets
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcaQ9SI0Xtihv-83AA0e4J7kxqcZl4DZhkDN8rf9Wlvj8efL444O4qRHzuuFALCcsxuQco43tVymqa/pub?output=csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        rows.forEach(row => {
            const [name, date, link, color] = row.split(',');
            const eventDate = new Date(date).getDate();
            const dayElements = document.querySelectorAll('.day');
            dayElements.forEach(dayEl => {
                const dateSpan = dayEl.querySelector('.date-number');
                if (dateSpan && parseInt(dateSpan.textContent) === eventDate) {
                    const preview = document.createElement('div');
                    preview.classList.add('event-preview');
                    preview.innerHTML = `<span style="color: ${color};">•</span> ${name.substring(0, 16)}...`;
                    dayEl.appendChild(preview);
                    dayEl.addEventListener('click', () => showEventLog([{ name, link, color }], eventDate));
                }
            });
        });
    });

function showEventLog(events, date) {
    eventContent.innerHTML = `<h2>Notikumi ${date}. datumā</h2>`;
    events.forEach(event => {
        const eventBox = document.createElement('div');
        eventBox.classList.add('event-box');
        eventBox.innerHTML = `<div class="event-details"><h3>${event.name}</h3><a href="${event.link}" target="_blank">Apskatīt vairāk</a></div>`;
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
