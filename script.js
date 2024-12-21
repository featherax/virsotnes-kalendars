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
// Ielādē datus no Google Sheets
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTcaQ9SI0Xtihv-83AA0e4J7kxqcZl4DZhkDN8rf9Wlvj8efL444O4qRHzuuFALCcsxuQco43tVymqa/pub?output=csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Izlaiž virsraksta rindu
        rows.forEach(row => {
            const [name, date, link, color] = row.split(',');
            const eventDate = new Date(date).getDate();

            // Atrodi pareizo dienas elementu
            const dayElements = document.querySelectorAll('.day');
            dayElements.forEach(dayEl => {
                const dateSpan = dayEl.querySelector('.date-number');
                if (dateSpan && parseInt(dateSpan.textContent) === eventDate) {
                    // Pievieno preview burbulīti un nosaukumu
                    const preview = document.createElement('div');
                    preview.classList.add('event-preview');
                    preview.innerHTML = `<span style="color: ${color};">•</span> ${name.length > 16 ? name.substring(0, 16) + '...' : name}`;
                    dayEl.appendChild(preview);

                    // Pilnais eventa elements priekš popup loga
                    const eventLink = document.createElement('a');
                    eventLink.href = link;
                    eventLink.target = '_blank';
                    eventLink.classList.add('event');
                    eventLink.style.color = '#0043b3'; // Tumši zils teksts
                    eventLink.innerHTML = `<span style="color: ${color}; font-size: 18px;">•</span> ${name}`;
                    dayEl.dataset.events = dayEl.dataset.events || '';
                    dayEl.dataset.events += preview.outerHTML + '\n';
                }
            });
        });
    })
    .catch(error => console.error('Error loading data:', error));


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
