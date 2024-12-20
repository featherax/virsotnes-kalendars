const calendar = document.getElementById('calendar');
const daysInMonth = 31;
const today = new Date().getDate();

// Decembris sākas ar svētdienu, tāpēc pirmā diena ir 7. pozīcijā (indekss 6, jo sākam no 0)
const firstDayOffset = 6;

// Pievieno tukšos elementus līdz pirmajai dienai (1. decembrim)
for (let i = 0; i < firstDayOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'inactive');
    calendar.appendChild(emptyDiv);
}

// Izveido dienas no 1 līdz 31
for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    if (day === today) {
        dayDiv.classList.add('today');
    }

    calendar.appendChild(dayDiv);
}

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
                if (parseInt(dayEl.textContent) === eventDate) {
                    dayEl.style.position = 'relative';
                    dayEl.innerHTML += `<a href="${link}" target="_blank" class="event" style="color: ${color};">${name}</a>`;
                }
            });
        });
    })
    .catch(error => console.error('Error loading data:', error));
