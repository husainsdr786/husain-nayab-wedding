(function () {
    'use strict';
    var gate = document.getElementById('wedding-gate');
    var content = document.getElementById('invitation-content');
    var openButton = document.getElementById('gate-open');
    var opening = false;

    function resetGate() {
        opening = false;
        gate.hidden = false;
        gate.classList.remove('is-opening', 'is-loading');
        content.inert = true;
        document.body.classList.add('gate-locked');
        document.documentElement.classList.add('gate-locked');
        if (window.scrollY !== 0 || document.documentElement.scrollTop !== 0) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        gate.setAttribute('tabindex', '-1');
        gate.focus({ preventScroll: true });
    }
    resetGate();
    // Bfcache (back/forward cache) can restore the page exactly as it was left,
    // including an already-opened gate — force it closed again on such restores.
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) resetGate();
    });

    function spawnCelebration() {
        var burst = document.createElement('div');
        burst.className = 'gate-burst';
        var sparkleColors = ['#ffd76a', '#ff9ecf', '#8fe3ff', '#fff'];
        for (var j = 0; j < 30; j++) {
            var color = sparkleColors[j % sparkleColors.length];
            var sparkle = document.createElement('i');
            sparkle.className = 'sparkle';
            sparkle.style.left = (Math.random() * 100) + '%';
            sparkle.style.background = color;
            sparkle.style.animationDelay = (Math.random() * 1.2) + 's';
            sparkle.style.animationDuration = (2 + Math.random()) + 's';
            burst.appendChild(sparkle);
        }
        document.body.appendChild(burst);
        window.setTimeout(function () { burst.remove(); }, 3600);
    }

    function openInvitation() {
        if (opening) return;
        opening = true;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gate.classList.add('is-loading');

        window.setTimeout(function () {
            gate.classList.remove('is-loading');
            gate.classList.add('is-opening');
            var audio = document.getElementById('my_audio');
            if (audio) audio.play().catch(function () { /* The invitation also works without audio. */ });
            if (!reducedMotion) spawnCelebration();
            window.setTimeout(function () {
                gate.hidden = true;
                content.inert = false;
                document.body.classList.remove('gate-locked');
                document.documentElement.classList.remove('gate-locked');
                content.focus({ preventScroll: true });
                window.dispatchEvent(new Event('invitation-opened'));
            }, reducedMotion ? 0 : 850);
        }, reducedMotion ? 0 : 1300);
    }

    openButton.addEventListener('click', openInvitation);
    gate.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') openInvitation();
        if (event.key === 'Tab') {
            event.preventDefault();
            openButton.focus();
        }
    });
})();

(function () {
    'use strict';
    var audio = document.getElementById('my_audio');
    var music = document.getElementById('music-toggle');
    function updateMusic() {
        music.setAttribute('aria-pressed', String(!audio.paused));
        music.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
        music.textContent = audio.paused ? '♫' : '♪';
    }
    audio.addEventListener('play', updateMusic);
    audio.addEventListener('pause', updateMusic);
    music.addEventListener('click', function () {
        if (audio.paused) audio.play().catch(updateMusic); else audio.pause();
    });
    var themeToggle = document.getElementById('theme-toggle');
    if (document.documentElement.classList.contains('dark')) {
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }
    themeToggle.addEventListener('click', function () {
        var dark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        this.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });

    (function () {
        var colorToggle = document.getElementById('color-theme-toggle');
        var swatches = Array.from(document.querySelectorAll('.swatch'));
        var accentNames = ['gold', 'rose', 'emerald', 'sapphire', 'burgundy'];
        var accentLabels = { gold: 'Gold', rose: 'Rose Blush', emerald: 'Emerald', sapphire: 'Sapphire', burgundy: 'Burgundy' };
        var currentAccent = document.documentElement.getAttribute('data-accent') || 'gold';

        function applyAccent(name) {
            currentAccent = name;
            if (name === 'gold') {
                document.documentElement.removeAttribute('data-accent');
                localStorage.removeItem('accentTheme');
            } else {
                document.documentElement.setAttribute('data-accent', name);
                localStorage.setItem('accentTheme', name);
            }
            if (colorToggle) {
                colorToggle.setAttribute('aria-label', 'Colour theme: ' + (accentLabels[name] || name) + '. Click to try the next one.');
                colorToggle.title = accentLabels[name] || name;
            }
            swatches.forEach(function (swatch) {
                var isActive = (swatch.dataset.accent || 'gold') === name;
                swatch.classList.toggle('active', isActive);
                swatch.setAttribute('aria-pressed', String(isActive));
            });
        }

        swatches.forEach(function (swatch) {
            swatch.addEventListener('click', function () { applyAccent(swatch.dataset.accent || 'gold'); });
        });
        if (colorToggle) {
            colorToggle.addEventListener('click', function () {
                var nextIndex = (accentNames.indexOf(currentAccent) + 1) % accentNames.length;
                applyAccent(accentNames[nextIndex]);
            });
        }
        applyAccent(currentAccent);
    })();
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var motion = document.getElementById('motion-toggle');
    var paused = reduced.matches;
    function updateMotion() {
        document.body.classList.toggle('paused', paused);
        motion.setAttribute('aria-pressed', String(paused));
        motion.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
        motion.textContent = paused ? '▷' : 'Ⅱ';
    }
    motion.addEventListener('click', function () { paused = !paused; updateMotion(); });
    updateMotion();
    for (var i = 0; i < 28; i++) {
        var petal = document.createElement('i');
        petal.className = 'petal';
        petal.style.left = (i * 37 % 100) + '%';
        petal.style.animationDuration = (11 + i % 9) + 's';
        petal.style.animationDelay = (-i * 1.3) + 's';
        petal.style.opacity = .25 + (i % 4) * .15;
        document.querySelector('.petals').appendChild(petal);
    }
    var stackGallery = document.querySelector('.stack-gallery');
    if (stackGallery) {
        var cards = Array.from(stackGallery.querySelectorAll('.stack-card'));
        var items = Array.from(stackGallery.querySelectorAll('.stack-item'));
        var photoDotsContainer = stackGallery.querySelector('.stack-photo-dots');
        var stackCurrent = 0;
        cards.forEach(function (card) {
            card.photos = Array.from(card.querySelectorAll(':scope > img'));
            card.photoIndex = 0;
        });
        function renderPhotoDots() {
            var card = cards[stackCurrent];
            photoDotsContainer.innerHTML = '';
            if (card.photos.length < 2) return;
            card.photos.forEach(function (photo, i) {
                var dot = document.createElement('button');
                dot.setAttribute('aria-label', 'Show photo ' + (i + 1));
                if (i === card.photoIndex) { dot.classList.add('active'); dot.setAttribute('aria-current', 'true'); }
                dot.addEventListener('click', function () { showPhoto(card, i); });
                photoDotsContainer.appendChild(dot);
            });
        }
        function showPhoto(card, index) {
            card.photoIndex = (index + card.photos.length) % card.photos.length;
            card.photos.forEach(function (photo, i) { photo.hidden = i !== card.photoIndex; });
            renderPhotoDots();
        }
        function showStack(index) {
            stackCurrent = (index + cards.length) % cards.length;
            cards.forEach(function (card, i) {
                var offset = (i - stackCurrent + cards.length) % cards.length;
                card.style.zIndex = String(cards.length - offset);
                card.style.opacity = offset === 0 ? '1' : String(Math.max(.35, .85 - offset * .25));
                card.style.transform = offset === 0 ? 'translate(0,0) scale(1)' : 'translate(' + offset * 12 + 'px,' + offset * 12 + 'px) scale(' + (1 - offset * .05) + ')';
            });
            items.forEach(function (item, i) {
                item.classList.toggle('active', i === stackCurrent);
                if (i === stackCurrent) item.setAttribute('aria-current', 'true'); else item.removeAttribute('aria-current');
            });
            renderPhotoDots();
        }
        items.forEach(function (item, i) { item.addEventListener('click', function () { showStack(i); }); });
        var stackPrev = stackGallery.querySelector('.stack-arrow-prev');
        var stackNext = stackGallery.querySelector('.stack-arrow-next');
        if (stackPrev) stackPrev.addEventListener('click', function () { showPhoto(cards[stackCurrent], cards[stackCurrent].photoIndex - 1); });
        if (stackNext) stackNext.addEventListener('click', function () { showPhoto(cards[stackCurrent], cards[stackCurrent].photoIndex + 1); });
        var stack = stackGallery.querySelector('.stack');
        var stackTouchStartX = null;
        stack.addEventListener('touchstart', function (event) { stackTouchStartX = event.touches[0].clientX; }, { passive: true });
        stack.addEventListener('touchend', function (event) {
            if (stackTouchStartX === null) return;
            var delta = event.changedTouches[0].clientX - stackTouchStartX;
            if (Math.abs(delta) > 40) showPhoto(cards[stackCurrent], cards[stackCurrent].photoIndex + (delta < 0 ? 1 : -1));
            stackTouchStartX = null;
        });
        showStack(0);
    }
    // Native `scroll-behavior:smooth` takes ~800ms+ for long in-page jumps
    // (e.g. top of page to the Date section), which reads as the page
    // endlessly scrolling. A short, fixed-duration scroll feels snappier.
    function smoothScrollTo(target) {
        var startY = window.scrollY;
        var offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        var targetY = target.getBoundingClientRect().top + startY - offset;
        var distance = targetY - startY;
        if (reduced.matches || Math.abs(distance) < 2) {
            window.scrollTo({ top: targetY, behavior: 'instant' });
            return;
        }
        var duration = 450;
        var startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            smoothScrollTo(target);
        });
    });
    var links = Array.from(document.querySelectorAll('.site-nav a'));
    function updateNavigation() {
        var selected = links[0];
        // Hidden sections have zero-sized rectangles while the gate is closed.
        // Keep Home selected until the invitation is visible and scrolled.
        if (!document.documentElement.classList.contains('gate-locked') && window.scrollY > 10) {
            links.forEach(function (link) {
                var section = document.querySelector(link.getAttribute('href'));
                if (section && section.getClientRects().length && section.getBoundingClientRect().top < window.innerHeight * .45) selected = link;
            });
        }
        links.forEach(function (link) {
            link.classList.toggle('active', link === selected);
            if (link === selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
    }
    window.addEventListener('scroll', updateNavigation, {passive:true});
    window.addEventListener('invitation-opened', updateNavigation);
    window.addEventListener('pageshow', updateNavigation);
    updateNavigation();
})();

(function () {
    'use strict';
    var yesButton = document.getElementById('rsvp-yes');
    var noButton = document.getElementById('rsvp-no');
    var status = document.getElementById('rsvp-status');
    if (!yesButton || !noButton || !status) return;
    function respond(selected, other, message) {
        selected.classList.add('is-selected');
        selected.setAttribute('aria-pressed', 'true');
        other.classList.remove('is-selected');
        other.setAttribute('aria-pressed', 'false');
        status.textContent = message;
        [selected, other, status].forEach(function (element) {
            element.classList.remove('rsvp-animate');
        });
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
            !document.documentElement.classList.contains('paused') &&
            !document.body.classList.contains('paused')) {
            // Restart on every click, including repeated selection of one option.
            void selected.offsetWidth;
            selected.classList.add('rsvp-animate');
            status.classList.add('rsvp-animate');
        }
    }
    [yesButton, noButton, status].forEach(function (element) {
        element.addEventListener('animationend', function (event) {
            if (event.target === element && !event.pseudoElement) element.classList.remove('rsvp-animate');
        });
    });
    yesButton.addEventListener('click', function () {
        respond(yesButton, noButton, "Thank you! We can't wait to celebrate with you.");
    });
    noButton.addEventListener('click', function () {
        respond(noButton, yesButton, "You’ll be missed. Your love and blessings mean so much to us.");
    });
    function resetResponse() {
        [yesButton, noButton].forEach(function (button) {
            button.classList.remove('is-selected', 'rsvp-animate');
            button.setAttribute('aria-pressed', 'false');
        });
        status.textContent = '';
    }
    resetResponse();
    window.addEventListener('pageshow', resetResponse);

})();

(function () {
    'use strict';
    var shareButton = document.getElementById('share-invite');
    var copyButton = document.getElementById('copy-link');
    var status = document.getElementById('share-status');
    if (!shareButton || !copyButton || !status) return;
    var shareText = "You're invited to Husain & Nayab's wedding!";
    shareButton.addEventListener('click', function () {
        if (navigator.share) {
            navigator.share({ title: document.title, text: shareText, url: location.href }).catch(function () {});
        } else {
            window.open('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + location.href), '_blank', 'noopener');
        }
    });
    copyButton.addEventListener('click', function () {
        function announce() {
            status.textContent = 'Link copied to clipboard!';
            window.setTimeout(function () { status.textContent = ''; }, 3000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(location.href).then(announce).catch(function () {
                status.textContent = 'Could not copy the link automatically.';
            });
        } else {
            status.textContent = 'Could not copy the link automatically.';
        }
    });
})();

(function () {
    'use strict';
    var sections = document.querySelectorAll('.reveal');
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) {
        sections.forEach(function (section) { section.classList.add('is-visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    sections.forEach(function (section) { observer.observe(section); });
})();

// Reserve the actual navigation height for mobile corner ornaments.
(function () {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    function updateFlowerClearance() {
        var height = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--mobile-nav-height', Math.ceil(height) + 'px');
    }
    updateFlowerClearance();
    if ('ResizeObserver' in window) new ResizeObserver(updateFlowerClearance).observe(nav);
    window.addEventListener('resize', updateFlowerClearance, { passive: true });
})();
