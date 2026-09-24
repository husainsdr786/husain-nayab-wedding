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

// Monogram photos: click or tap pops the photo up to the centre with a gold ring, its names and a heart burst.
(function () {
    'use strict';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var photos = document.querySelectorAll('.opening-screen .photo-ring, #home .photo-ring, #couple .photo-ring');
    if (!photos.length) return;
    function translate(text) { return window.weddingI18n ? window.weddingI18n.translate(text) : text; }

    var pop = document.createElement('div');
    pop.className = 'photo-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-modal', 'true');
    pop.hidden = true;
    pop.innerHTML = '<div class="photo-pop-backdrop"></div>' +
        '<div class="photo-pop-body">' +
        '<button type="button" class="photo-pop-close" aria-label="Close">&times;</button>' +
        '<div class="photo-pop-frame"><span class="photo-pop-ring" aria-hidden="true"></span><img alt=""></div>' +
        '<p class="photo-pop-name"></p><p class="photo-pop-caption"></p>' +
        '</div>';
    document.body.appendChild(pop);
    var frame = pop.querySelector('.photo-pop-frame');
    var image = pop.querySelector('img');
    var nameEl = pop.querySelector('.photo-pop-name');
    var captionEl = pop.querySelector('.photo-pop-caption');
    var closeButton = pop.querySelector('.photo-pop-close');
    var source = null;

    // Lets the pop-up grow out of (and shrink back into) the photo that was clicked.
    function flight(from) {
        var a = from.getBoundingClientRect(), b = frame.getBoundingClientRect();
        var scale = a.width / b.width;
        return 'translate(' + (a.left + a.width / 2 - (b.left + b.width / 2)) + 'px,' + (a.top + a.height / 2 - (b.top + b.height / 2)) + 'px) scale(' + scale + ')';
    }
    function burst() {
        if (reducedMotion.matches || document.documentElement.classList.contains('paused')) return;
        var rect = frame.getBoundingClientRect();
        for (var i = 0; i < 28; i++) {
            var particle = document.createElement('span');
            particle.className = 'name-celebration-particle photo-pop-particle' + (i % 2 ? '' : ' burst-heart');
            particle.setAttribute('aria-hidden', 'true');
            particle.textContent = i % 2 ? '✦' : '♥';
            var angle = Math.PI * 2 * i / 28, distance = rect.width / 2 + 40 + Math.random() * 70;
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.color = i % 2 ? 'var(--accent)' : (i % 4 ? '#c96b80' : 'var(--accent)');
            particle.style.animationDelay = (i % 4 * 45) + 'ms';
            particle.style.setProperty('--burst-x', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--burst-y', Math.sin(angle) * distance + 'px');
            particle.style.setProperty('--burst-turn', (Math.random() * 100 - 50) + 'deg');
            document.body.appendChild(particle);
            (function (element) { window.setTimeout(function () { element.remove(); }, 2300); })(particle);
        }
    }
    function open(ring) {
        source = ring;
        var person = ring.closest('.person');
        var img = ring.querySelector('img');
        image.src = img.currentSrc || img.src;
        image.alt = img.alt;
        if (person) {
            nameEl.textContent = person.querySelector('.person-name').textContent.trim();
            captionEl.textContent = person.querySelector('.person-role').textContent.trim();
        } else {
            // Opening screen and hero both show the pair of names beside their photo.
            var scope = ring.closest('.opening-screen, .hero-content');
            nameEl.textContent = scope.querySelector('h1.couple-name').textContent.replace(/\s+/g, ' ').trim();
            captionEl.textContent = translate('Together, by the grace of Allah');
        }
        pop.setAttribute('aria-label', nameEl.textContent);
        closeButton.setAttribute('aria-label', translate('Close'));
        pop.hidden = false;
        document.documentElement.classList.add('photo-pop-open');
        requestAnimationFrame(function () {
            pop.classList.add('is-open');
            // The burst fires once the photo has landed, so it centres on the pop-up rather than the starting spot.
            if (!reducedMotion.matches && frame.animate) {
                frame.animate([{transform: flight(ring), opacity: .6}, {transform: 'none', opacity: 1}], {duration: 520, easing: 'cubic-bezier(.22, 1.2, .36, 1)'}).onfinish = burst;
            } else burst();
            closeButton.focus({preventScroll: true});
        });
    }
    function close() {
        if (pop.hidden) return;
        pop.classList.remove('is-open');
        document.documentElement.classList.remove('photo-pop-open');
        var done = function () { pop.hidden = true; if (source) source.focus({preventScroll: true}); };
        if (!reducedMotion.matches && frame.animate && source) {
            frame.animate([{transform: 'none', opacity: 1}, {transform: flight(source), opacity: .4}], {duration: 360, easing: 'cubic-bezier(.4, 0, .2, 1)'}).onfinish = done;
        } else done();
    }
    photos.forEach(function (ring) {
        ring.classList.add('photo-pop-trigger');
        ring.setAttribute('role', 'button');
        ring.setAttribute('tabindex', '0');
        ring.setAttribute('aria-label', translate('View photo'));
        ring.addEventListener('click', function () { open(ring); });
        ring.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(ring); }
        });
    });
    pop.querySelector('.photo-pop-backdrop').addEventListener('click', close);
    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
})();
