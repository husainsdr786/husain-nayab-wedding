(function () {
    'use strict';
    var date = new Date(document.body.dataset.weddingDate);
    var calendarLink = document.getElementById('add-calendar');
    if (!Number.isFinite(date.getTime())) {
        calendarLink.removeAttribute('href');
        calendarLink.setAttribute('aria-disabled', 'true');
        document.getElementById('ceremony-time').textContent = 'Time to be announced';
        return;
    }
    document.getElementById('ceremony-time').textContent = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata'
    }).format(date) + ' IST';

    function calendarDate(value) {
        return value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }
    // Google Calendar opens an editable draft with a default one-hour duration.
    var end = new Date(date.getTime() + 60 * 60 * 1000);
    var params = new URLSearchParams({
        action: 'TEMPLATE',
        text: 'Husain & Nayab - Wedding Ceremony',
        dates: calendarDate(date) + '/' + calendarDate(end),
        ctz: 'Asia/Kolkata',
        location: 'Chaudhary Palace Hotel & Marriage Hall',
        details: 'Join us to celebrate the wedding of Husain and Nayab. Dinner and celebration to follow.'
    });
    calendarLink.href = 'https://calendar.google.com/calendar/render?' + params.toString();
})();
