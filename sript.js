document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. WIDGET DE HORARIO EN TIEMPO REAL
    // ==========================================
    function updateBusinessStatus() {
        const now = new Date();
        const currentHour = now.getHours();

        const statusBadgeHeader = document.getElementById("status-badge-header");
        const statusTextHeader = document.getElementById("status-text-header");
        
        const liveIndicatorFooter = document.getElementById("live-indicator-footer");
        const liveStatusText = document.getElementById("live-status-text");

        const isOpen = currentHour >= 8 && currentHour < 20;

        if (isOpen) {
            if (statusTextHeader) statusTextHeader.textContent = "Abierto Ahora";
            if (statusBadgeHeader) statusBadgeHeader.querySelector(".pulse-dot").classList.remove("closed");
            
            if (liveStatusText) {
                liveStatusText.textContent = "Abierto Ahora";
                liveStatusText.style.color = "var(--accent-green)";
            }
            if (liveIndicatorFooter) liveIndicatorFooter.querySelector(".pulse-dot").classList.remove("closed");
        } else {
            if (statusTextHeader) statusTextHeader.textContent = "Cerrado";
            if (statusBadgeHeader) statusBadgeHeader.querySelector(".pulse-dot").classList.add("closed");
            
            if (liveStatusText) {
                liveStatusText.textContent = "Cerrado por hoy";
                liveStatusText.style.color = "var(--accent-rose)";
            }
            if (liveIndicatorFooter) liveIndicatorFooter.querySelector(".pulse-dot").classList.add("closed");
        }
    }

    updateBusinessStatus();
    setInterval(updateBusinessStatus, 60000);


    // ==========================================
    // 2. FILTRADO DINÁMICO DE LA CARTA
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuCards = document.querySelectorAll(".menu-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            menuCards.forEach(card => {
                const cardCategories = card.getAttribute("data-category").split(" ");
                
                if (filterValue === "all" || cardCategories.includes(filterValue)) {
                    card.style.display = "block";
                    card.style.opacity = "0";
                    card.style.transform = "translateY(15px) scale(0.98)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0) scale(1)";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });


    // ==========================================
    // 3. SLIDER DE TESTIMONIOS (CORREGIDO)
    // ==========================================
    const reviews = document.querySelectorAll(".review-card");
    const prevBtn = document.getElementById("prev-rev");
    const nextBtn = document.getElementById("next-rev");
    let currentReviewIndex = 0;
    let autoRotate;

    function showReview(index) {
        reviews.forEach((review, i) => {
            if (i === index) {
                review.classList.add("active");
                review.style.opacity = "1";
                review.style.visibility = "visible";
                review.style.transform = "scale(1)";
            } else {
                review.classList.remove("active");
                review.style.opacity = "0";
                review.style.visibility = "hidden";
                review.style.transform = "scale(0.98)";
            }
        });
    }

    // Inicializamos mostrando explícitamente la primera opinión
    showReview(currentReviewIndex);

    function startAutoRotate() {
        clearInterval(autoRotate); // Limpiamos cualquier intervalo duplicado
        autoRotate = setInterval(() => {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            showReview(currentReviewIndex);
        }, 7000);
    }

    const stopAutoRotate = () => {
        clearInterval(autoRotate);
    };

    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evita interferencias con animaciones de contenedores padres
            stopAutoRotate();
            currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
            showReview(currentReviewIndex);
            startAutoRotate(); // Reinicia el temporizador para suavizar la transición automática
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopAutoRotate();
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            showReview(currentReviewIndex);
            startAutoRotate();
        });
    }

    // Soporte táctil (Swipe) para smartphones en reviews
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector(".reviews-slider-container");

    if (sliderContainer) {
        sliderContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        sliderContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        stopAutoRotate();
        if (touchStartX - touchEndX > 50) {
            // Swipe Left -> Siguiente
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            showReview(currentReviewIndex);
        }
        if (touchEndX - touchStartX > 50) {
            // Swipe Right -> Anterior
            currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
            showReview(currentReviewIndex);
        }
        startAutoRotate();
    }

    startAutoRotate();


    // ==========================================
    // 4. BOTÓN FLOTANTE VOLVER ARRIBA
    // ==========================================
    const scrollTopBtn = document.getElementById("scroll-to-top");

    window.addEventListener("scroll", () => {
        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // ==========================================
    // 5. EFECTO REVEAL CON SCROLL (CORREGIDO)
    // ==========================================
    // Se ha quitado '.reviews-slider-container' de este selector para que el fade-in inicial
    // no interfiera con los eventos de clic y visibilidad del slider de opiniones.
    const revealElements = document.querySelectorAll(".hero-content, .express-widget, .menu-card, .exp-text, .board-classic, .footer-col");
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target); // Solo se anima una vez para no cargar el navegador
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        element.classList.add("reveal-hidden");
        revealOnScroll.observe(element);
    });


    // ==========================================
    // 6. MENÚ HAMBURGUESA INTERACTIVO PARA MÓVILES
    // ==========================================
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            menuToggle.classList.toggle("active");
        });

        // Cerrar menú al hacer click en cualquier link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.classList.remove("active");
            });
        });
    }


    // ==========================================
    // 7. FEEDBACK HÁPTICO VISUAL AL TOCAR BOTONES (Efecto Ripple)
    // ==========================================
    const rippleButtons = document.querySelectorAll(".btn, .filter-btn, .whatsapp-floating-btn, .scroll-top-btn");

    rippleButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripple = document.createElement("span");
            ripple.classList.add("ripple-effect");
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

});