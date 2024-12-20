const calendar = document.getElementById('calendar');
const daysInMonth = 31;
const today = new Date().getDate();

// Decembris sākas ar svētdienu, tāpēc pirmā diena ir 7. pozīcijā (indekss 6, jo sākam no 0)
const firstDayOffset = 6;

// Pievieno tukšos elementus līdz pirmajai dienai (1. decembrim)
for (let i = 0; i < firstDayOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day');
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
