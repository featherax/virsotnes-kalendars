const calendar = document.getElementById('calendar');
const eventLog = document.getElementById('event-log');
const eventContent = document.getElementById('event-content');
const backToCalendar = document.getElementById('back-to-calendar');

// Kalendāra datumi un struktūra
const daysInMonth = 31; // Decembris
const today = new Date().getDate();

// Decembris sākas ar svētdienu (indekss 6, jo sākam no 0)
const firstDayOffset = 6;

// Pievieno tukšos laukus pirms 1. decembra
for (let i = 0; i < firstDayOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'inactive');
    calendar.appendChild(emptyDiv);
}

// Ģenerē dienas no 1 līdz 31
for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');

    const dateSpan = document.createElement('span');
    dateSpan.textContent = day;
    dateSpan.classList.add('date-number');
    dayDiv.appendChild(dateSpan);

    if (day === today) {
        dayDiv.classList.add('today');
    }

    calendar.appendChild(dayDiv);
}

// Pievieno tukšos elementus pēc pēdējās dienas
const remainingDays = (7 - ((firstDayOffset + daysInMonth) % 7)) % 7;
for (let i = 0; i < remainingDays; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'inactive');
    calendar.appendChild(emptyDiv);
}

// Datu ielāde no Google Sheets
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcaQ9SI0Xtihv-83AA0e4J7kxqcZl4DZhkDN8rf9Wlvj8efL444O4qRHzuuFALCcsxuQco43tVymqa/pub?output=csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Izlaiž virsraksta rindu
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
    })
    .catch(error => console.error('Kļūda ielādējot datus:', error));

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
