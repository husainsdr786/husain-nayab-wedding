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
        // The desktop side panel carries a compact copy of the same countdown.
        document.querySelectorAll('[data-count]').forEach(function (field) {
            field.textContent = String(values[units.indexOf(field.dataset.count)]).padStart(2, '0');
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

// Sticky header: show the "Wedding Invitation" bar once the hero's own chip and kicker have scrolled out of view.
(function () {
    var bar = document.querySelector('.invite-bar');
    var kicker = document.querySelector('.hero .hero-kicker');
    var column = document.querySelector('.invitation-column');
    var nav = document.querySelector('.site-nav');
    if (!bar || !kicker) return;
    function update() {
        // Tablet keeps the section nav at the top, so the bar tucks in below it.
        var top = nav && getComputedStyle(nav).top === '0px' ? nav.getBoundingClientRect().bottom : 0;
        var col = column.getBoundingClientRect();
        bar.style.setProperty('--bar-top', top + 'px');
        bar.style.setProperty('--bar-left', col.left + 'px');
        bar.style.setProperty('--bar-width', col.width + 'px');
        bar.classList.toggle('is-shown', kicker.getBoundingClientRect().bottom < top);
        // In-page jumps land just below the bar.
        document.documentElement.style.scrollPaddingTop = top + bar.offsetHeight + 12 + 'px';
    }
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    window.addEventListener('invitation-opened', update);
    update();
})();

// Desktop side panel: mirrors the ceremony time, proxies the hero actions and switches its stage with the section in view.
(function () {
    var panel = document.querySelector('.visual-panel');
    if (!panel) return;

    // Ceremony time is localised on #ceremony-time; keep the panel copy in step with it.
    var ceremony = document.getElementById('ceremony-time');
    function syncTime() {
        panel.querySelectorAll('[data-ceremony-time]').forEach(function (el) { el.textContent = ceremony.textContent; });
    }
    if (ceremony) {
        syncTime();
        new MutationObserver(syncTime).observe(ceremony, {childList: true, characterData: true, subtree: true});
    }

    // Calendar and Share reuse the hero buttons, so their links and share logic live in one place.
    panel.querySelectorAll('[data-proxy]').forEach(function (button) {
        button.addEventListener('click', function () {
            var source = document.getElementById(button.dataset.proxy);
            if (source) source.click();
        });
    });

    // Dress Code and Venue raise a floating bar at the bottom of the panel; other sections show none.
    var stage = panel.querySelector('.visual-stage');
    if (!stage) return;
    var paneFor = {'#dress-code': 'dress', '#venue': 'venue'};
    function update() {
        var active = document.querySelector('.site-nav a.active');
        stage.dataset.pane = paneFor[active ? active.getAttribute('href') : ''] || 'none';
    }
    // The nav already tracks the section in view; follow its active link.
    document.querySelectorAll('.site-nav a').forEach(function (link) {
        new MutationObserver(update).observe(link, {attributes: true, attributeFilter: ['class']});
    });
    update();
})();
