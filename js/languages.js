(function () {
    'use strict';
    var dictionary = window.weddingTranslations;
    // Every language the invitation knows. To add one: give it an entry here, add its
    // text as a new column in translations.js (column is that array index), then set
    // enabled: true. The pickers on both pages are built from this list automatically.
    var LANGUAGES = {
        en: { name: 'English', native: 'English', locale: 'en-GB', dir: 'ltr', enabled: true,
            title: 'Husain & Nayab | Wedding Invitation' },
        ur: { name: 'Urdu', native: 'اردو', locale: 'ur-PK', dir: 'rtl', column: 1, localImages: true, enabled: false,
            title: 'حسین اور نایاب | دعوتِ شادی' },
        hi: { name: 'Hindi', native: 'हिन्दी', locale: 'hi-IN', dir: 'ltr', column: 0, localImages: true, enabled: false,
            title: 'हुसैन और नायाब | विवाह निमंत्रण', zone: ' भारतीय समय' },
        ar: { name: 'Arabic', native: 'العربية', locale: 'ar', dir: 'rtl', column: 2, localImages: true, enabled: false,
            title: 'حسين وناياب | دعوة زفاف', zone: ' بتوقيت الهند' }
    };
    var languages = Object.keys(LANGUAGES).filter(function (code) { return LANGUAGES[code].enabled; });
    var language = 'en';
    var sources = new WeakMap();
    var attributeSources = new WeakMap();
    var normalized = {};
    function clean(value) { return value.replace(/\s+/g, ' ').trim(); }
    Object.keys(dictionary).forEach(function (key) { normalized[clean(key)] = dictionary[key]; });
    function translate(value) {
        if (language === 'en') return value;
        var key = clean(value), index = LANGUAGES[language].column; // column in each [hi, ur, ar] dictionary entry
        if (normalized[key]) return normalized[key][index];
        var photo = key.match(/^Show photo (\d+)$/);
        if (photo) return ['तस्वीर ', 'تصویر ', 'الصورة '][index] + photo[1];
        if (key.includes('— celebrate with hearts and stars')) {
            return key.split(' — ')[0].replace(/Athar Husain|Samar Nayab/g, function (name) { return normalized[name][index]; }) + [' — दिल और सितारे दिखाएँ', ' — دل اور ستارے دکھائیں', ' — احتفل بالقلوب والنجوم'][index];
        }
        if (key.startsWith('Colour theme:')) return normalized['Change colour theme'][index];
        if (key.startsWith('Map to ')) return ['स्थल का नक्शा', 'مقام کا نقشہ', 'خريطة المكان'][index];
        if (/^(Ceremony|Reception|Memories) photo \d+$/.test(key)) return ['समारोह की तस्वीर', 'تقریب کی تصویر', 'صورة من الاحتفال'][index] + ' ' + key.match(/\d+$/)[0];
        if (key.includes('placeholder') || key.startsWith('Placeholder portrait')) return ['दूल्हा-दुल्हन की प्रतीकात्मक तस्वीर', 'دولہا دلہن کی علامتی تصویر', 'صورة رمزية للعروسين'][index];
        if (key.startsWith('Suggested colors:')) return ['सुझाए गए रंग: आइवरी, सेज और गहरा हरा', 'تجویز کردہ رنگ: عاجی، ہلکا اور گہرا سبز', 'الألوان المقترحة: عاجي وأخضر فاتح وداكن'][index];
        return value.replace(/Athar Husain|Samar Nayab/g, function (name) { return normalized[name][index]; });
    }
    function translateText(node) {
        if (!node.parentElement || node.parentElement.closest('script, style, svg, [data-language-ui], [data-localized-date], .arabic[lang="ar"], cite[lang="ar"], .countdown-ring')) return;
        var record = sources.get(node);
        if (!record || node.nodeValue !== record.output) record = { source: node.nodeValue };
        var value = translate(record.source);
        // Preserve whitespace separating text from inline icons.
        record.output = value === record.source ? value : (record.source.match(/^\s*/)[0] + value + record.source.match(/\s*$/)[0]);
        sources.set(node, record);
        if (node.nodeValue !== record.output) node.nodeValue = record.output;
    }
    function translateAttributes(element) {
        if (element.closest('[data-language-ui]')) return;
        var records = attributeSources.get(element) || {};
        ['aria-label', 'title', 'alt'].forEach(function (attribute) {
            if (!element.hasAttribute(attribute)) return;
            var value = element.getAttribute(attribute), record = records[attribute];
            if (!record || value !== record.output) record = { source: value };
            record.output = translate(record.source);
            records[attribute] = record;
            if (value !== record.output) element.setAttribute(attribute, record.output);
        });
        attributeSources.set(element, records);
    }
    function translateTree(root) {
        if (root.nodeType === Node.TEXT_NODE) { translateText(root); return; }
        if (root.nodeType !== Node.ELEMENT_NODE) return;
        translateAttributes(root);
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) translateText(node);
            else translateAttributes(node);
        }
    }
    var weddingDate = new Date(document.body.dataset.weddingDate);
    function dates() {
        if (!Number.isFinite(weddingDate.getTime())) return;
        function set(selector, value) {
            document.querySelectorAll(selector).forEach(function (element) {
                element.setAttribute('data-localized-date', '');
                element.textContent = value;
            });
        }
        var options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata', calendar: 'gregory' };
        var date = new Intl.DateTimeFormat(LANGUAGES[language].locale, options);
        set('[data-wedding-date-label]', date.format(weddingDate));
        set('[data-full-date], .visual-card-date', new Intl.DateTimeFormat(LANGUAGES[language].locale, Object.assign({}, options, { weekday: 'long' })).format(weddingDate));
        set('[data-walima-date]', date.format(new Date('2026-11-22T11:00:00+05:30')));
        var time = new Intl.DateTimeFormat(language === 'ur' ? 'en-US' : LANGUAGES[language].locale, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
        function clock(value) {
            if (language !== 'ur') return time.format(value) + (LANGUAGES[language].zone || ' IST');
            // Urdu reads "رات 9:00 بجے"; a Latin AM/PM inside RTL text reorders badly.
            var parts = time.formatToParts(value), hour = +parts.find(function (p) { return p.type === 'hour'; }).value;
            var pm = parts.find(function (p) { return p.type === 'dayPeriod'; }).value.toLowerCase().indexOf('p') === 0;
            var hour24 = hour % 12 + (pm ? 12 : 0);
            var period = hour24 < 12 ? 'صبح' : hour24 < 16 ? 'دوپہر' : hour24 < 19 ? 'شام' : 'رات';
            var digits = hour + ':' + parts.find(function (p) { return p.type === 'minute'; }).value;
            return period + ' \u2066' + digits + '\u2069 بجے (بھارتی وقت)';
        }
        set('#ceremony-time', clock(weddingDate));
        set('[data-walima-time]', clock(new Date('2026-11-22T11:00:00+05:30')));
    }
    function localizeIntegrations() {
        document.querySelectorAll('.stack-card img').forEach(function (image) {
            if (!image.dataset.originalSrc) image.dataset.originalSrc = image.getAttribute('src');
            var source = image.dataset.originalSrc;
            image.src = !LANGUAGES[language].localImages ? source : source.replace('assets/img/', 'assets/img/' + language + '/');
        });
        var frame = document.querySelector('.map-embed iframe');
        if (frame) {
            var map = new URL(frame.src);
            if (map.searchParams.get('hl') !== language) {
                map.searchParams.set('hl', language);
                frame.src = map.toString();
            }
        }
        var calendar = document.getElementById('add-calendar');
        if (calendar && calendar.hasAttribute('href')) {
            var url = new URL(calendar.href);
            url.searchParams.set('text', translate('Husain & Nayab - Wedding Ceremony'));
            url.searchParams.set('details', translate('Join us to celebrate the wedding of Husain and Nayab. Dinner and celebration to follow.'));
            url.searchParams.set('location', translate('Chaudhary Palace Hotel & Marriage Hall'));
            url.searchParams.set('hl', language);
            calendar.href = url.toString();
        }
    }
    window.weddingI18n = {
        translate: translate,
        shareUrl: function () {
            var url = new URL(location.href);
            url.searchParams.set('lang', language);
            return url.toString();
        }
    };
    // Language shutter: a slim globe tab on the right edge; tapping it slides a panel of
    // languages out from the edge. One is built on the opening screen and one on the page.
    var badges = { en: 'EN', ur: 'UR', hi: 'HI', ar: 'AR' };
    var shutters = [];
    var globeIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    var closeIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    var checkIcon = '<svg class="lang-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // The opening-screen copy lives on <body>, outside the gate's scroll box, so it stays flush with the screen edge.
    [document.getElementById('wedding-gate') && document.body, document.getElementById('invitation-content')].forEach(function (host, hostIndex) {
        if (!host) return;
        var root = document.createElement('div');
        var panelId = 'lang-panel-' + hostIndex;
        root.className = hostIndex === 0 ? 'lang-shutter lang-shutter-gate' : 'lang-shutter';
        root.dir = 'ltr';
        root.setAttribute('data-language-ui', '');
        root.innerHTML = '<div class="lang-panel" id="' + panelId + '" role="listbox" aria-label="Language"><p class="lang-panel-title">Language</p></div>' +
            '<button class="lang-tab" type="button" aria-expanded="false" aria-controls="' + panelId + '" aria-label="Choose language"><span class="lang-tab-open">' + globeIcon + '</span><span class="lang-tab-close">' + closeIcon + '</span></button>';
        var panel = root.firstChild, tab = root.lastChild;
        var options = languages.map(function (code) {
            var info = LANGUAGES[code];
            var option = document.createElement('button');
            option.type = 'button';
            option.className = 'lang-option';
            option.setAttribute('role', 'option');
            option.dataset.value = code;
            option.innerHTML = '<span class="lang-badge"></span><span class="lang-text"><strong></strong><small></small></span>' + checkIcon;
            option.querySelector('.lang-badge').textContent = badges[code] || code.toUpperCase();
            option.querySelector('strong').textContent = info.native;
            option.querySelector('strong').lang = code;
            option.querySelector('small').textContent = info.native === info.name ? '' : info.name;
            option.addEventListener('click', function () { setOpen(false, true); apply(code); });
            panel.appendChild(option);
            return option;
        });
        function setOpen(open, returnFocus) {
            root.classList.toggle('open', open);
            tab.setAttribute('aria-expanded', String(open));
            panel.inert = !open;
            if (open) (options.find(function (o) { return o.dataset.value === language; }) || options[0]).focus({ preventScroll: true });
            else if (returnFocus) tab.focus({ preventScroll: true });
        }
        tab.addEventListener('click', function () { setOpen(!root.classList.contains('open')); });
        document.addEventListener('click', function (event) { if (!root.contains(event.target)) setOpen(false); });
        root.addEventListener('keydown', function (event) {
            var index = options.indexOf(document.activeElement);
            if (event.key === 'Escape' && root.classList.contains('open')) {
                // Stop here so Escape on the opening screen doesn't also open the invitation.
                event.preventDefault(); event.stopPropagation(); setOpen(false, true);
            } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && index > -1) {
                event.preventDefault();
                options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
            }
        });
        panel.inert = true;
        host.appendChild(root);
        shutters.push(options);
    });
    function syncShutters() {
        shutters.forEach(function (options) {
            options.forEach(function (option) { option.setAttribute('aria-selected', String(option.dataset.value === language)); });
        });
    }
    function apply(value) {
        language = languages.includes(value) ? value : 'en';
        document.documentElement.lang = language;
        document.documentElement.dir = LANGUAGES[language].dir;
        dates();
        translateTree(document.body);
        localizeIntegrations();
        document.title = LANGUAGES[language].title;
        syncShutters();
        try { localStorage.setItem('wedding-language', language); } catch (_) {}
        window.dispatchEvent(new Event('resize'));
    }
    try { language = localStorage.getItem('wedding-language') || 'en'; } catch (_) {}
    var requestedLanguage = new URLSearchParams(location.search).get('lang');
    if (languages.includes(requestedLanguage)) language = requestedLanguage;
    apply(language);
    // Translate dynamic RSVP, copy feedback and accessibility labels without
    // replacing buttons, SVGs, or nodes used by the existing animation handlers.
    new MutationObserver(function (records) {
        records.forEach(function (record) {
            if (record.type === 'characterData') translateText(record.target);
            else if (record.type === 'attributes') translateAttributes(record.target);
            else record.addedNodes.forEach(translateTree);
        });
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'alt'] });
})();
