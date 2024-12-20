const calendar = document.getElementById('calendar');
const daysInMonth = 31;
const today = new Date().getDate();

for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;

    if (day === today) {
        dayDiv.classList.add('today');
    }

    calendar.appendChild(dayDiv);
}
