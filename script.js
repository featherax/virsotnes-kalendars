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

    const dateSpan = document.createElement('span');
    dateSpan.textContent = day;
    dateSpan.classList.add('date-number');
    dayDiv.appendChild(dateSpan);

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

            // Saīsina event nosaukumu, ja tas pārsniedz 12 rakstzīmes
            const truncatedName = name.length > 12 ? name.substring(0, 12) + "..." : name;

            // Atrodi pareizo dienas elementu
            const dayElements = document.querySelectorAll('.day');
            dayElements.forEach(dayEl => {
                const dateSpan = dayEl.querySelector('.date-number');
                if (dateSpan && parseInt(dateSpan.textContent) === eventDate) {
                    const eventLink = document.createElement('a');
                    eventLink.href = link;
                    eventLink.target = '_blank';
                    eventLink.classList.add('event');
                    eventLink.style.color = '#0043b3'; // Tumši zils teksts
                    eventLink.innerHTML = `<span style="color: ${color}; font-size: 18px;">•</span> ${truncatedName}`;
                    dayEl.appendChild(eventLink);
                }
            });
        });
    })
    .catch(error => console.error('Error loading data:', error));
