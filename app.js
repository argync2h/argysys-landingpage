document.documentElement.classList.add('js-ready');

const scrollToCurrentHash = () => {
    if (!window.location.hash) {
        return;
    }

    const target = document.querySelector(window.location.hash);

    if (!target) {
        return;
    }

    const topbar = document.querySelector('.topbar');
    const headerOffset = topbar ? topbar.offsetHeight + 28 : 120;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
    });
};

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2,
            rootMargin: '0px 0px -8% 0px',
        },
    );

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const wrapper = document.querySelector('[data-parallax-wrapper]');
const layers = document.querySelectorAll('[data-parallax]');

if (wrapper && layers.length) {
    wrapper.addEventListener('mousemove', (event) => {
        const rect = wrapper.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        layers.forEach((layer) => {
            const depth = Number(layer.getAttribute('depth') || 0);
            const moveX = (-x / rect.width) * depth;
            const moveY = (-y / rect.height) * depth;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    wrapper.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            layer.style.transform = 'translate3d(0, 0, 0)';
        });
    });
}

const carouselRoot = document.querySelector('[data-carousel]');

if (carouselRoot) {
    const slides = Array.from(carouselRoot.querySelectorAll('[data-slide]'));
    const dots = Array.from(carouselRoot.querySelectorAll('[data-carousel-dot]'));
    const prevButton = carouselRoot.querySelector('[data-carousel-prev]');
    const nextButton = carouselRoot.querySelector('[data-carousel-next]');
    let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
    let autoplayId;

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    const renderCarousel = (nextIndex) => {
        currentIndex = (nextIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentIndex);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentIndex);
        });
    };

    const restartAutoplay = () => {
        window.clearInterval(autoplayId);
        autoplayId = window.setInterval(() => {
            renderCarousel(currentIndex + 1);
        }, 4800);
    };

    prevButton?.addEventListener('click', () => {
        renderCarousel(currentIndex - 1);
        restartAutoplay();
    });

    nextButton?.addEventListener('click', () => {
        renderCarousel(currentIndex + 1);
        restartAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            renderCarousel(index);
            restartAutoplay();
        });
    });

    carouselRoot.addEventListener('mouseenter', () => {
        window.clearInterval(autoplayId);
    });

    carouselRoot.addEventListener('mouseleave', restartAutoplay);

    renderCarousel(currentIndex);
    restartAutoplay();
}

window.addEventListener('hashchange', () => {
    window.requestAnimationFrame(scrollToCurrentHash);
});

window.addEventListener('load', () => {
    window.setTimeout(scrollToCurrentHash, 120);
});

if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
        window.setTimeout(scrollToCurrentHash, 60);
    });
}
