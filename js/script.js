(function () {
    'use strict';
    // One explicit, timezone-aware date powers both the labels and countdown.
    var weddingDate = new Date(document.body.dataset.weddingDate);
    var target = weddingDate.getTime();
    var status = document.getElementById('countdown-status');
    if (!Number.isFinite(target)) {
        status.textContent = 'Our wedding date will be announced soon.';
        return;
    }
    var label = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
    }).format(weddingDate);
    document.querySelectorAll('[data-wedding-date-label]').forEach(function (element) {
        element.textContent = label;
    });
    document.querySelectorAll('[data-full-date]').forEach(function (element) {
        element.textContent = new Intl.DateTimeFormat('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata'}).format(weddingDate);
    });
    var units = ['days', 'hours', 'minutes', 'seconds'];
    var fields = units.map(function (unit) {
        return document.getElementById('countdown-' + unit);
    });
    var rings = units.map(function (unit) {
        return document.getElementById('ring-' + unit);
    });
    // "Days" rings show the remaining share of the whole engagement period, anchored to a
    // fixed calendar start date (not "days since this page happened to load") so every
    // visitor sees the same, genuinely depleting ring as the wedding date approaches.
    var countdownStart = new Date('2026-09-18T00:00:00+05:30').getTime();
    var totalDaysSpan = Math.max(1, Math.ceil((target - countdownStart) / 86400000));
    var ringMax = { days: totalDaysSpan, hours: 24, minutes: 60, seconds: 60 };
    var ringCircumference = 2 * Math.PI * 19;

    var timer;
    function updateCountdown() {
        var remaining = Math.max(0, target - Date.now());
        var totalSeconds = Math.floor(remaining / 1000);
        var values = [Math.floor(totalSeconds / 86400), Math.floor(totalSeconds / 3600) % 24,
            Math.floor(totalSeconds / 60) % 60, totalSeconds % 60];
        fields.forEach(function (field, index) {
            field.textContent = String(values[index]).padStart(2, '0');
        });
        rings.forEach(function (ring, index) {
            if (!ring) return;
            var fraction = Math.min(1, values[index] / ringMax[units[index]]);
            ring.style.strokeDashoffset = String(ringCircumference * (1 - fraction));
        });
        if (remaining === 0) {
            status.textContent = 'Together forever. Let the celebration begin!';
            window.clearInterval(timer);
        }
    }
    updateCountdown();
    if (target > Date.now()) timer = window.setInterval(updateCountdown, 1000);
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) updateCountdown();
    });
})();
