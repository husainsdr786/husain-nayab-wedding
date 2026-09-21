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

// Celebrate each name on hover, tap, or keyboard activation.
(function () {
    'use strict';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('.couple-name').forEach(function (name) {
        if (!name.closest('[aria-hidden="true"]')) {
            name.setAttribute('role', 'button');
            name.setAttribute('tabindex', '0');
            name.setAttribute('aria-label', name.textContent.trim() + ' — celebrate with hearts and stars');
        }
        function burst() {
            if (reducedMotion.matches || document.documentElement.classList.contains('paused') || document.body.classList.contains('paused')) return;
            var rect = name.getBoundingClientRect();
            var color = getComputedStyle(name).color;
            for (var i = 0; i < 32; i++) {
                var particle = document.createElement('span');
                particle.className = 'name-celebration-particle' + (i % 2 ? '' : ' burst-heart');
                particle.setAttribute('aria-hidden', 'true');
                particle.textContent = i % 2 ? '✦' : '♥';
                var angle = Math.PI * 2 * i / 32;
                var distance = 85 + Math.random() * 95;
                particle.style.left = (rect.left + rect.width * (0.2 + Math.random() * 0.6)) + 'px';
                particle.style.top = (rect.top + rect.height / 2) + 'px';
                particle.style.color = i % 2 ? 'var(--accent)' : color;
                particle.style.animationDelay = (i % 4 * 45) + 'ms';
                particle.style.setProperty('--burst-x', Math.cos(angle) * distance + 'px');
                particle.style.setProperty('--burst-y', Math.sin(angle) * distance - 35 + 'px');
                particle.style.setProperty('--burst-turn', (Math.random() * 100 - 50) + 'deg');
                document.body.appendChild(particle);
                // Also clean up if animations are paused while a burst is running.
                (function (element) { window.setTimeout(function () { element.remove(); }, 2000); })(particle);
            }
        }
        name.addEventListener('pointerenter', function (event) {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') burst();
        });
        name.addEventListener('click', burst);
        name.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!event.repeat) burst();
            }
        });
    });
})();
