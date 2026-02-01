function initApp() {
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');

    // Setup No/Yes behaviors only if those elements exist on the page
    if (yesButton && noButton) {
        const container = noButton.parentElement; // .button-container

        function moveNoButton() {
            const containerRect = container.getBoundingClientRect();
            const noRect = noButton.getBoundingClientRect();
            const yesRect = yesButton.getBoundingClientRect();

            const margin = 6; // keep a small margin from edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // adjust movement range dynamically so it feels right on phones and desktop
        let extraRange = Math.floor(containerRect.width * 0.6);
        if (viewportWidth < 480) {
            // allow a generous but clamped move on tiny screens
            extraRange = Math.max(40, Math.floor(containerRect.width * 0.6));
        }
        // prevent extraRange from exceeding a fraction of the viewport
        extraRange = Math.max(40, Math.min(extraRange, Math.floor(viewportWidth * 0.35)));
            const minX = -extraRange;
            const maxX = Math.max(0, Math.floor(containerRect.width - noRect.width - margin + extraRange));
            const minY = -extraRange;
            const maxY = Math.max(0, Math.floor(containerRect.height - noRect.height - margin + extraRange));

            let attempts = 0;
            let x, y, noLeft, noTop, overlap;

            do {
                x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
                y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

                noLeft = containerRect.left + x;
                noTop = containerRect.top + y;

                // Clamp to viewport with small padding so button stays visible
                const pad = 8;
                const absLeft = Math.min(Math.max(noLeft, pad), viewportWidth - pad - noRect.width);
                const absTop = Math.min(Math.max(noTop, pad), viewportHeight - pad - noRect.height);

                // Recompute x,y relative to container after clamping
                x = absLeft - containerRect.left;
                y = absTop - containerRect.top;

                // Detect overlap with yes button (using clamped coordinates)
                overlap = !(absLeft + noRect.width < yesRect.left || absLeft > yesRect.right || absTop + noRect.height < yesRect.top || absTop > yesRect.bottom);
                attempts++;
            } while (overlap && attempts < 20);

            // Apply new absolute position (left/top relative to container)
            noButton.style.left = x + 'px';
            noButton.style.top = y + 'px';
            noButton.style.transform = 'none';
        }

        // Move on pointer enter (hover), click, focus and touch
        ['pointerenter', 'click', 'focus', 'touchstart'].forEach(evt => {
            noButton.addEventListener(evt, moveNoButton);
        });

        // Keyboard activation should also move it
        noButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                moveNoButton();
            }
        });

        // Heart pop + confetti on Yes then navigate
        const confettiContainer = document.getElementById('confetti-container');
        function createConfetti(count, originX, originY) {
            const colors = ['#ff6aa6','#ffd166','#ffb3d9','#d63384','#ff7ab6'];
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                el.className = 'confetti';
                el.style.background = colors[Math.floor(Math.random()*colors.length)];
                el.style.left = (originX + (Math.random()*60-30)) + 'px';
                el.style.top = (originY + (Math.random()*20-10)) + 'px';
                // make confetti fall slower and feel smoother
                const dur = 1400 + Math.floor(Math.random()*900); // 1400–2300ms
                el.style.animation = `confetti-fall ${dur}ms cubic-bezier(.2,.6,.3,1)`;
                el.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`;
                if (confettiContainer) confettiContainer.appendChild(el);
                // remove later
                setTimeout(()=> el.remove(), dur + 200);
            }
        }

        yesButton.addEventListener('click', function() {
            const heart = yesButton.querySelector('.heart');
            if (heart) {
                heart.classList.add('pop');
                setTimeout(()=> heart.classList.remove('pop'), 600);
            }
            // compute origin roughly at center of card
            const cardRect = yesButton.closest('.card').getBoundingClientRect();
            const originX = cardRect.left + cardRect.width/2;
            const originY = cardRect.top + cardRect.height/2 - 20;
            createConfetti(20, originX, originY);
            // delay so animation is seen
            setTimeout(()=> { window.location.href = 'gallery.html'; }, 700);
        });
    }

    // Always attempt to reveal the gallery if present
    const galleryGrid = document.querySelector('.image-container');
    const galleryMsg = document.querySelector('.gallery-message');
    if (galleryGrid) setTimeout(()=> galleryGrid.classList.add('show'), 60);
    if (galleryMsg) {
        galleryMsg.classList.add('sparkle');
        setTimeout(()=> galleryMsg.classList.remove('sparkle'), 2800);
    }

    // fallback: if images still hidden after 400ms, force show (guards against errors)
    setTimeout(()=> {
        const g = document.querySelector('.image-container');
        if (g && !g.classList.contains('show')) g.classList.add('show');
    }, 400);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
