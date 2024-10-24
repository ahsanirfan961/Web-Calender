
let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let currentMonth = 9;
let currentYear = 2024;
let currentWeek = 1;

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

let events = [
    { [formatDate(new Date(2024, 9, 20))]: ["Event 1", "Event 2"] },
    { [formatDate(new Date(2024, 9, 4))]: ["Event 1", "Event 2"] },
    { [formatDate(new Date(2023, 6, 14))]: ["Ahsan's Birthday"] },
]

var emptyCalEntry = document.createElement('div');
emptyCalEntry.classList.add('cal-entry');
emptyCalEntry.innerHTML = '-';

function displayMonth(month, year) {
    let calBody = document.getElementsByClassName('cal-body')[0];
    calBody.innerHTML = '';
    let date = new Date(year, month, 1);
    let startDay = date.getDay();
    for (let i = 0; i < 35; i++) {
        if (i < startDay)
            calBody.appendChild(emptyCalEntry.cloneNode(true));
        else if (i >= startDay + new Date(year, month + 1, 0).getDate()) {
            calBody.appendChild(emptyCalEntry.cloneNode(true));
        }
        else {
            let calEntry = document.createElement('div');
            calEntry.onclick = function() {
                addEvent(formatDate(new Date(currentYear, currentMonth, i - startDay + 1)));
            }
            calEntry.classList.add('cal-entry');
            calEntry.innerHTML = '<p>' + (i - startDay + 1) + '</p>';
            dateString = formatDate(new Date(year, month, i - startDay + 1));
            current_events = events.find(e => Object.keys(e)[0] == dateString);
            if (current_events) {
                current_events = current_events[dateString];
                calEntry.classList.add('event');
                if (window.innerWidth > 576) {
                    calEntry.innerHTML += '<h4>Events:</h4>';
                    eventList = document.createElement('ul');
                    for (let event in current_events) {
                        eventList.innerHTML += '<li>' + current_events[event] + '</li>';
                    }
                    calEntry.appendChild(eventList);
                }
                else {
                    calEntry.innerHTML += '<br><h6>' + current_events.length + ' Events</h6>';
                }
            }
            calBody.appendChild(calEntry);
        }
    }
    
}

function displayWeek(week, month, year) {
    let calBody = document.getElementsByClassName('cal-body')[0];
    calBody.innerHTML = '';
    let date = new Date(year, month, 1);
    let startDay = date.getDay();
    for (let i = (week-1)*7; i < week*7; i++) {
        if (i < startDay)
            calBody.appendChild(emptyCalEntry.cloneNode(true));
        else if (i >= startDay + new Date(year, month + 1, 0).getDate()) {
            calBody.appendChild(emptyCalEntry.cloneNode(true));
        }
        else {
            let calEntry = document.createElement('div');
            calEntry.onclick = function() {
                addEvent(formatDate(new Date(currentYear, currentMonth, i - startDay + 1)));
            }
            calEntry.classList.add('cal-entry');
            calEntry.innerHTML = '<p>' + (i - startDay + 1) + '</p>';
            dateString = formatDate(new Date(year, month, i - startDay + 1));
            current_events = events.find(e => Object.keys(e)[0] == dateString);
            if (current_events) {
                current_events = current_events[dateString];
                calEntry.classList.add('event');
                if (window.innerWidth > 576) {
                    calEntry.innerHTML += '<h4>Events:</h4>';
                    eventList = document.createElement('ul');
                    for (let event in current_events) {
                        eventList.innerHTML += '<li>' + current_events[event] + '</li>';
                    }
                    calEntry.appendChild(eventList);
                }
                else {
                    calEntry.innerHTML += '<br><h6>' + current_events.length + ' Events</h6>';
                }
            }
            calBody.appendChild(calEntry);
        }
    }
}

function updateMonthYear() {
    document.getElementById('month-btn').innerHTML = monthNames[currentMonth];
    document.getElementById('year-btn').innerHTML = currentYear;
}

document.getElementById('ctype-btn').addEventListener('click', function () {
    if (document.getElementById('ctype-btn').innerHTML == 'Month') {
        document.getElementById('ctype-btn').innerHTML = 'Week';
        displayWeek(1, currentMonth, currentYear);
    }
    else {
        document.getElementById('ctype-btn').innerHTML = 'Month';
        displayMonth(currentMonth, currentYear);
    }
});

document.getElementById('prev-btn').addEventListener('click', function () {
    if (document.getElementById('ctype-btn').innerHTML == 'Month') {
        currentYear = currentMonth == 0 ? currentYear - 1 : currentYear;
        currentMonth = currentMonth == 0 ? 11 : currentMonth - 1;
        displayMonth(currentMonth, currentYear);
    } else {
        if (currentWeek == 1) {
            currentYear = currentMonth == 0 ? currentYear - 1 : currentYear;
            currentMonth = currentMonth == 0 ? 11 : currentMonth - 1;
            currentWeek = Math.ceil(new Date(currentYear, currentMonth + 1, 0).getDate() / 7);
        } else {
            currentWeek -= 1;
        }
        displayWeek(currentWeek, currentMonth, currentYear);
    }
    updateMonthYear();
});

document.getElementById('next-btn').addEventListener('click', function () {
    if (document.getElementById('ctype-btn').innerHTML == 'Month') {
        currentYear = currentMonth == 11 ? currentYear + 1 : currentYear;
        currentMonth = currentMonth == 11 ? 0 : currentMonth + 1;
        displayMonth(currentMonth, currentYear);
    } else {
        if (currentWeek == 5) {
            currentYear = currentMonth == 11 ? currentYear + 1 : currentYear;
            currentMonth = currentMonth == 11 ? 0 : currentMonth + 1;
            currentWeek = 1;
        } else {
            currentWeek += 1;
        }
        displayWeek(currentWeek, currentMonth, currentYear);
    }
    updateMonthYear();
});

function addEvent(date) {
    let modalCanvas = document.getElementById('modal-canvas');
    modalCanvas.style.display = 'block';
    let eventForm = document.getElementById('event-form');

    var newForm = eventForm.cloneNode(true);
    eventForm.parentNode.replaceChild(newForm, eventForm);
    
    let eventText = document.getElementById('event');

    function handleFormSubmit(event){
        event.preventDefault();
        existedEntry = events.find(e => Object.keys(e)[0] == date);
        if(existedEntry)
            existedEntry[date].push(eventText.value);
        else
            events.push({[date]: [eventText.value]});
        modalCanvas.style.display = 'none';
        if (document.getElementById('ctype-btn').innerHTML == 'Month') {
            displayMonth(currentMonth, currentYear);
        }
        else {
            displayWeek(currentWeek, currentMonth, currentYear);
        }
    }
    newForm.addEventListener('submit', handleFormSubmit);
}

function closeModal(){
    document.getElementById('modal-canvas').style.display = 'none';
}


displayMonth(currentMonth, currentYear);
// displayWeek(2, currentMonth, currentYear);