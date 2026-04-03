// Dynamically adjust font size based on the current scale to maintain readability
function getBoostedFontSize(scale) {
    const root = document.documentElement;

    const base = 16;
    const MIN_FONT = 13;
    const MAX_FONT = 17;

    if (scale >= 1) {
        root.style.fontSize = `${base}px`;
        return base;
    }

    // logarithmic compensation (natural perception)
    const k = 0.5; // tuning factor (0.4–0.6 ideal)
    const compensation = 1 + k * Math.log2(1 / scale);

    let newSize = base * compensation;

    // clamp
    newSize = Math.max(MIN_FONT, Math.min(newSize, MAX_FONT));
    newSize = Math.round(newSize);

    root.style.fontSize = `${newSize}px`;

    return newSize;
}

// Auto-scale the slide to fit any screen while keeping perfect 16:9 ratio
function scaleSlide() {
    const container = document.querySelector('.slide-container');
    if (!container) return;

    const isLandscape = window.innerWidth > window.innerHeight;

    let maxWidth, maxHeight;

    if (window.innerWidth < 768) {
        // Small mobile devices
        if (isLandscape) {
            // Landscape mode on phone -> use almost full screen
            maxWidth = window.innerWidth * 0.98;
            maxHeight = window.innerHeight * 0.96;
        } else {
            // Portrait mode on phone -> force landscape feel by limiting height
            maxWidth = window.innerWidth * 0.96;
            maxHeight = window.innerHeight * 0.82;   // leave space for browser UI
        }
    } else {
        // Tablets & Desktops
        maxWidth = window.innerWidth * 0.96;
        maxHeight = (window.innerHeight - 0) * 0.96;
    }

    const scaleX = maxWidth / 1280;
    const scaleY = maxHeight / 720;
    let scale = Math.min(scaleX, scaleY);

    // Minimum scale so it doesn't become too tiny, using 0
    scale = Math.max(scale, 0);

    container.style.transform = `translate(-50%, -50%) scale(${scale})`;

    getBoostedFontSize(scale);
}

// Run scaling
window.addEventListener('load', scaleSlide);
window.addEventListener('resize', scaleSlide);
window.addEventListener('orientationchange', () => {
    setTimeout(scaleSlide, 100);   // small delay for orientation change
});