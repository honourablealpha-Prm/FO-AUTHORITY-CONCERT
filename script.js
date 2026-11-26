
/* =========================================================
   FO AUTHORITY — BIRTHDAY CONCERT EXPERIENCE
   Cinematic Directional Zoom Carousel
   Guest Registration System
========================================================= */

import {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
} from "./backend/supabase-config.js";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ELEMENT REFERENCES
    ===================================================== */

    const gsapEngine = window.gsap || null;

    const pageLoader = document.getElementById("pageLoader");
    const portraitStage = document.getElementById("portraitStage");
    const portraitImage = document.getElementById("mainPortrait");

    const navItems = document.querySelectorAll(".nav-item");
    const brandLink = document.querySelector(".brand");
    const contentPanels = document.querySelectorAll(".content-panel");
    const currentSectionLabel = document.getElementById("currentSectionLabel");

    const registrationForm = document.getElementById("guestRegistrationForm");

    const formSteps = registrationForm
        ? registrationForm.querySelectorAll(".form-step")
        : [];

    const progressSteps = document.querySelectorAll(".progress-step");
    const progressTrack = document.getElementById("progressTrack");
    const formSuccess = document.getElementById("formSuccess");
    const returnButton = document.getElementById("returnToExperience");

    const guestName = document.getElementById("guestName");
    const guestEmail = document.getElementById("guestEmail");
    const guestPhone = document.getElementById("guestPhone");
    const guestMessage = document.getElementById("guestMessage");

    const registrationConsent = document.getElementById("registrationConsent");

    /* =====================================================
       2. SECTION CONFIGURATION
    ===================================================== */

    const sectionOrder = [
        "welcome",
        "about",
        "celebration",
        "registration",
        "contact"
    ];

    const sectionSettings = {

        welcome: {
            label: "WELCOME",
            image: "assets/images/backgrounds/FO1.jpeg",
            scale: 1.08,
            position: "center center"
        },

        about: {
            label: "ABOUT FO",
            image: "assets/images/backgrounds/FO2.jpeg",
            scale: 1.12,
            position: "center 35%"
        },

        celebration: {
            label: "THE CELEBRATION",
            image: "assets/images/backgrounds/img7.jfif",
            scale: 1.10,
            position: "center center"
        },

        registration: {
            label: "REGISTRATION",
            image: "assets/images/backgrounds/img4.jfif",
            scale: 1.14,
            position: "center 30%"
        },

        contact: {
            label: "CONTACT",
            image: "assets/images/backgrounds/img1.jfif",
            scale: 1.08,
            position: "center center"
        }

    };

    // Preload navigation background images.

    Object.values(sectionSettings).forEach(settings => {

        const image = new Image();
        image.src = settings.image;

    });

    let currentSection = "welcome";
    let currentStep = 1;
    let isTransitioning = false;
    let activeTimeline = null;


    /* =====================================================
   3A. MOBILE REGISTRATION NAVIGATION GUIDE
===================================================== */

const registrationGuideKey = "foAuthorityMobileRegistrationGuideSeen";

function showMobileRegistrationGuide() {

    // Mobile devices only.
    if (!window.matchMedia("(max-width: 768px)").matches) {
        return;
    }

    // Find the Registration navigation icon.
    const registrationNavItem = document.querySelector(
         '.nav-item[data-section="registration"]'
    );

    if (!registrationNavItem) return;

    // Show only once per browser.
    try {

        if (localStorage.getItem(registrationGuideKey) === "true") {
            return;
        }

        localStorage.setItem(registrationGuideKey, "true");

    } catch (error) {

        console.warn("Registration guide storage unavailable:", error);

    }

    // Highlight the Registration navigation item.
    registrationNavItem.classList.add("registration-guide-highlight");

    // Create the guidance message.
    const guide = document.createElement("div");

    guide.className = "mobile-registration-guide";

    guide.innerHTML = `
        <span class="guide-pointer">↓</span>
        <span class="guide-message">
            WANT TO REGISTER?
            <strong>TAP HERE</strong>
        </span>
    `;

    document.body.appendChild(guide);

    // Position the message relative to the navigation icon.
    function positionGuide() {

        const rect = registrationNavItem.getBoundingClientRect();

        const guideTop = rect.top > 100
            ? rect.top - 66
            : rect.bottom + 12;

        guide.style.left = `${rect.left + rect.width / 2}px`;
        guide.style.top = `${guideTop}px`;

        guide.classList.toggle(
            "guide-below",
            rect.top <= 100
        );

    }

    positionGuide();

    // Show the animation.
    requestAnimationFrame(() => {
        guide.classList.add("guide-visible");
    });

    // Remove after approximately 4 seconds.
    window.setTimeout(() => {

        guide.classList.remove("guide-visible");

        registrationNavItem.classList.remove(
            "registration-guide-highlight"
        );

        window.setTimeout(() => {
            guide.remove();
        }, 500);

    }, 4000);

}




/* =====================================================
   FO AUTHORITY — AUTOMATIC BACKGROUND MUSIC
===================================================== */

const backgroundAudio = new Audio(
    "./assets/audio/anandlessocean-juba.mp3"
);

backgroundAudio.loop = true;
backgroundAudio.volume = 0.35;
backgroundAudio.preload = "auto";

let audioUnlocked = false;


// CREATE SOUND BUTTON

const audioControl = document.createElement("button");

audioControl.type = "button";
audioControl.className = "background-audio-control";

audioControl.innerHTML = `
    <span class="audio-control-icon">♫</span>
    <span class="audio-control-text">ENABLE SOUND</span>
`;

audioControl.setAttribute(
    "aria-label",
    "Enable background music"
);

document.body.appendChild(audioControl);


// UPDATE SOUND BUTTON

function updateAudioControl() {

    const text = audioControl.querySelector(
        ".audio-control-text"
    );

    if (backgroundAudio.paused || backgroundAudio.muted) {

        text.textContent = "ENABLE SOUND";

        audioControl.classList.remove("audio-playing");

    } else {

        text.textContent = "SOUND ON";

        audioControl.classList.add("audio-playing");

    }

}


// ATTEMPT AUDIBLE AUTOPLAY IMMEDIATELY

async function startBackgroundMusic() {

    try {

        backgroundAudio.muted = false;

        await backgroundAudio.play();

        audioUnlocked = true;

        updateAudioControl();

        console.log("FO AUTHORITY MUSIC STARTED");

    } catch (error) {

        console.warn(
            "Browser blocked audible autoplay:",
            error
        );

        updateAudioControl();

    }

}


// FIRST VISIT AUTOPLAY ATTEMPT

startBackgroundMusic();


// START MUSIC ON FIRST VISITOR INTERACTION

async function unlockBackgroundAudio() {

    if (audioUnlocked) return;

    try {

        backgroundAudio.muted = false;

        await backgroundAudio.play();

        audioUnlocked = true;

        updateAudioControl();

        document.removeEventListener(
            "pointerdown",
            unlockBackgroundAudio,
            true
        );

        document.removeEventListener(
            "keydown",
            unlockBackgroundAudio,
            true
        );

    } catch (error) {

        console.warn("Audio still requires interaction:", error);

    }

}


document.addEventListener(
    "pointerdown",
    unlockBackgroundAudio,
    true
);

document.addEventListener(
    "keydown",
    unlockBackgroundAudio,
    true
);


// TOP-RIGHT SOUND BUTTON

audioControl.addEventListener("click", async () => {

    if (backgroundAudio.paused || backgroundAudio.muted) {

        backgroundAudio.muted = false;

        try {

            await backgroundAudio.play();

            audioUnlocked = true;

        } catch (error) {

            console.error("Unable to play music:", error);

        }

    } else {

        backgroundAudio.pause();

        audioUnlocked = false;

    }

    updateAudioControl();

});



// KEEP BUTTON SYNCHRONISED

backgroundAudio.addEventListener("play", updateAudioControl);
backgroundAudio.addEventListener("pause", updateAudioControl);
backgroundAudio.addEventListener("volumechange", updateAudioControl);

updateAudioControl();


    /* =====================================================
       3. ICON INITIALISATION
    ===================================================== */

    function refreshIcons() {

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }

    }

    refreshIcons();

    /* =====================================================
       4. NAVIGATION INDICATOR
    ===================================================== */

    function updateNavigation(sectionName) {

        const settings = sectionSettings[sectionName];

        if (!settings) return;

        if (currentSectionLabel) {
            currentSectionLabel.textContent = settings.label;
        }

        navItems.forEach(item => {

            const isActive = item.dataset.section === sectionName;

            item.classList.toggle("active", isActive);

            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }

        });

    }

    /* =====================================================
       5. INITIAL SECTION DISPLAY
    ===================================================== */

    function showPanelImmediately(sectionName) {

        const settings = sectionSettings[sectionName];

        if (!settings) return;

        contentPanels.forEach(panel => {

            const isActive = panel.dataset.content === sectionName;

            panel.classList.toggle("active", isActive);

            if (gsapEngine) {

                gsapEngine.killTweensOf(panel);

                gsapEngine.set(panel, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: isActive ? 1 : 0,
                    filter: "blur(0px)"
                });

            }

        });

        currentSection = sectionName;

        if (portraitImage) {

            portraitImage.src = settings.image;
            portraitImage.style.objectPosition = settings.position;

            if (gsapEngine) {

                gsapEngine.set(portraitImage, {
                    x: 0,
                    y: 0,
                    yPercent: 0,
                    scale: settings.scale,
                    opacity: 1,
                    filter: "blur(0px) brightness(1)"
                });

            }

        }

        updateNavigation(sectionName);



}

    /* =====================================================
       6. CINEMATIC SECTION TRANSITION
    ===================================================== */

    function switchSection(sectionName) {

        if (
            isTransitioning ||
            sectionName === currentSection ||
            !sectionSettings[sectionName]
        ) {
            return;
        }

        const currentIndex = sectionOrder.indexOf(currentSection);
        const nextIndex = sectionOrder.indexOf(sectionName);

        if (currentIndex === -1 || nextIndex === -1) return;

        const currentPanel = Array.from(contentPanels).find(
            panel => panel.dataset.content === currentSection
        );

        const nextPanel = Array.from(contentPanels).find(
            panel => panel.dataset.content === sectionName
        );

        const settings = sectionSettings[sectionName];

        if (!currentPanel || !nextPanel) return;

        const direction = nextIndex > currentIndex ? 1 : -1;

        if (!gsapEngine || !portraitImage) {

            currentPanel.classList.remove("active");

            showPanelImmediately(sectionName);

            isTransitioning = false;

            return;
        }

        isTransitioning = true;

        if (activeTimeline) {
            activeTimeline.kill();
            activeTimeline = null;
        }

        gsapEngine.killTweensOf([
            portraitImage,
            currentPanel,
            nextPanel
        ]);

        // Reset outgoing scene.

        gsapEngine.set(portraitImage, {
            x: 0,
            y: 0,
            yPercent: 0,
            scale: sectionSettings[currentSection].scale,
            opacity: 1,
            filter: "blur(0px) brightness(1)"
        });

        gsapEngine.set(currentPanel, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)"
        });

        gsapEngine.set(nextPanel, {
            x: 0,
            y: direction * 115,
            scale: 0.88,
            opacity: 0,
            filter: "blur(10px)"
        });

        // Create transition timeline.

        const timeline = gsapEngine.timeline({

            onComplete: () => {

                currentSection = sectionName;
                isTransitioning = false;
                activeTimeline = null;

                gsapEngine.set(portraitImage, {
                    x: 0,
                    y: 0,
                    yPercent: 0,
                    scale: settings.scale,
                    opacity: 1,
                    filter: "blur(0px) brightness(1)"
                });

                gsapEngine.set(nextPanel, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)"
                });

                gsapEngine.set(currentPanel, {
                    clearProps: "transform,filter"
                });

                

            }

        });

        activeTimeline = timeline;

        // PHASE 1 — Outgoing content.

        timeline.to(currentPanel, {
            y: direction * -110,
            scale: 0.91,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.48,
            ease: "power2.in"
        }, 0);

        // PHASE 2 — Outgoing portrait.

        timeline.to(portraitImage, {
            yPercent: direction * -12,
            scale: 1.25,
            opacity: 0.25,
            filter: "blur(5px) brightness(0.72)",
            duration: 0.58,
            ease: "power2.in"
        }, 0);

        // PHASE 3 — Switch incoming scene.

        timeline.add(() => {

            currentPanel.classList.remove("active");
            nextPanel.classList.add("active");

            portraitImage.src = settings.image;
            portraitImage.style.objectPosition = settings.position;

            gsapEngine.set(nextPanel, {
                x: 0,
                y: direction * 115,
                scale: 0.88,
                opacity: 0,
                filter: "blur(10px)"
            });

            gsapEngine.set(portraitImage, {
                x: 0,
                y: 0,
                yPercent: direction * 18,
                scale: 1.25,
                opacity: 0.35,
                filter: "blur(6px) brightness(0.72)"
            });

            updateNavigation(sectionName);

        }, 0.60);

        // PHASE 4 — Incoming portrait zoom.

        timeline.to(portraitImage, {
            yPercent: 0,
            scale: settings.scale,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.10,
            ease: "power3.out"
        }, 0.60);

        // PHASE 5 — Incoming content.

        timeline.to(nextPanel, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out"
        }, 0.70);

    }

    /* =====================================================
       7. NAVIGATION CLICK EVENTS
    ===================================================== */

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const sectionName = item.dataset.section;

            if (sectionName) {
                switchSection(sectionName);
            }

        });

    });

    // Brand navigation.

    if (brandLink) {

        brandLink.addEventListener("click", event => {

            event.preventDefault();

            switchSection("welcome");

        });

    }

    // Initial section.

    showPanelImmediately("welcome");
    // Show the mobile registration guide on first visit.
window.setTimeout(() => {
    showMobileRegistrationGuide();
}, 1200);

    if (gsapEngine && portraitImage) {

        gsapEngine.set(portraitImage, {
            x: 0,
            y: 0,
            yPercent: 0,
            scale: sectionSettings.welcome.scale,
            opacity: 1,
            filter: "blur(0px)"
        });

    }

    /* =====================================================
       8. SUBTLE POINTER MOVEMENT
    ===================================================== */

    if (
        portraitStage &&
        portraitImage &&
        window.matchMedia("(pointer: fine)").matches &&
        gsapEngine
    ) {

        portraitStage.addEventListener("pointermove", event => {

            if (isTransitioning) return;

            const bounds = portraitStage.getBoundingClientRect();

            const centerX = bounds.left + bounds.width / 2;

            const moveX = (event.clientX - centerX) / bounds.width;

            gsapEngine.to(portraitImage, {
                x: moveX * 7,
                duration: 0.9,
                ease: "power2.out",
                overwrite: "auto"
            });

        });

        portraitStage.addEventListener("pointerleave", () => {

            if (isTransitioning) return;

            gsapEngine.to(portraitImage, {
                x: 0,
                duration: 1,
                ease: "power3.out",
                overwrite: "auto"
            });

        });

    }

    /* =====================================================
       9. PAGE LOADER
    ===================================================== */

    function hideLoader() {

        if (!pageLoader) return;

        if (gsapEngine) {

            gsapEngine.to(pageLoader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",

                onComplete: () => {
                    pageLoader.style.display = "none";
                }

            });

        } else {

            pageLoader.style.display = "none";

        }

    }

    window.addEventListener("load", () => {
        window.setTimeout(hideLoader, 500);
    });

    if (document.readyState === "complete") {
        window.setTimeout(hideLoader, 500);
    }

    /* =====================================================
       10. GUEST ATTENDANCE COUNTER
    ===================================================== */

    let additionalGuestCount = 0;

    const decreaseGuests = document.getElementById("decreaseGuests");
    const increaseGuests = document.getElementById("increaseGuests");

    const additionalGuestsDisplay = document.getElementById("additionalGuests");
    const guestSummary = document.getElementById("guestSummary");
    const totalAttendees = document.getElementById("totalAttendees");

    function updateGuestCount() {

        if (additionalGuestsDisplay) {
            additionalGuestsDisplay.textContent = additionalGuestCount;
        }

        if (guestSummary) {
            guestSummary.textContent = additionalGuestCount;
        }

        if (totalAttendees) {
            totalAttendees.textContent = additionalGuestCount + 1;
        }

        if (decreaseGuests) {
            decreaseGuests.disabled = additionalGuestCount === 0;
        }

    }

    if (increaseGuests) {

        increaseGuests.addEventListener("click", () => {

            if (additionalGuestCount >= 20) return;

            additionalGuestCount++;

            updateGuestCount();

        });

    }

    if (decreaseGuests) {

        decreaseGuests.addEventListener("click", () => {

            if (additionalGuestCount > 0) {

                additionalGuestCount--;

                updateGuestCount();

            }

        });

    }

    updateGuestCount();

    /* =====================================================
       11. REGISTRATION FORM SETUP
    ===================================================== */

    if (!registrationForm) {
        refreshIcons();
        return;
    }

    /* =====================================================
       12. FORM VALIDATION
    ===================================================== */

    function clearFieldError(field) {

        if (!field) return;

        const wrapper = field.closest(".form-field");

        if (!wrapper) return;

        const error = wrapper.querySelector(".field-error");

        wrapper.classList.remove("has-error");

        field.removeAttribute("aria-invalid");

        if (error) {
            error.textContent = "";
        }

    }

    function showFieldError(field, message) {

        if (!field) return;

        const wrapper = field.closest(".form-field");

        if (!wrapper) return;

        const error = wrapper.querySelector(".field-error");

        wrapper.classList.add("has-error");

        field.setAttribute("aria-invalid", "true");

        if (error) {
            error.textContent = message;
        }

    }

    function validateField(field) {

        if (!field) return true;

        clearFieldError(field);

        const value = field.value.trim();

        if (field.required && !value) {

            showFieldError(
                field,
                "This field is required."
            );

            return false;

        }

        if (
            field.type === "email" &&
            value &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {

            showFieldError(
                field,
                "Enter a valid email address."
            );

            return false;

        }

        if (
            field.id === "guestPhone" &&
            value &&
            value.replace(/\D/g, "").length < 7
        ) {

            showFieldError(
                field,
                "Enter a valid phone number."
            );

            return false;

        }

        return true;

    }

    function validateStep(stepNumber) {

        // STEP 01 — Personal information.

        if (stepNumber === 1) {

            const fields = [
                guestName,
                guestEmail,
                guestPhone
            ];

            let isValid = true;

            fields.forEach(field => {

                if (!validateField(field)) {
                    isValid = false;
                }

            });

            if (!isValid) {

                const firstInvalid = fields.find(field => {

                    return field &&
                        field.getAttribute("aria-invalid") === "true";

                });

                if (firstInvalid) {
                    firstInvalid.focus();
                }

            }

            return isValid;

        }

        // STEP 02 — Additional guests.
        // No ticket dropdown or ticket quantity validation.

        return true;

    }

    // Clear errors when users edit their details.

    [
        guestName,
        guestEmail,
        guestPhone,
        guestMessage
    ].forEach(field => {

        if (!field) return;

        field.addEventListener("input", () => {
            clearFieldError(field);
        });

        field.addEventListener("change", () => {
            clearFieldError(field);
        });

    });

    /* =====================================================
       13. FORM STEP NAVIGATION
    ===================================================== */

    function showStep(stepNumber) {

        const maxStep = formSteps.length;

        if (
            stepNumber < 1 ||
            stepNumber > maxStep
        ) {
            return;
        }

        currentStep = stepNumber;

        // Activate the correct form step.

        formSteps.forEach(step => {

            const isActive =
                Number(step.dataset.step) === stepNumber;

            step.classList.toggle("active", isActive);

            if (!isActive && gsapEngine) {
                gsapEngine.killTweensOf(step);
            }

        });

        // Update progress indicators.

        progressSteps.forEach(step => {

            const number = Number(step.dataset.progress);

            step.classList.toggle(
                "active",
                number === stepNumber
            );

            step.classList.toggle(
                "completed",
                number < stepNumber
            );

        });

        if (progressTrack) {

            progressTrack.style.width =
                stepNumber === 1 ? "0%" :
                stepNumber === 2 ? "50%" :
                "100%";

        }

        const activeStep = registrationForm.querySelector(
            `.form-step[data-step="${stepNumber}"]`
        );

        // Animate the active step.

        if (activeStep && gsapEngine) {

            gsapEngine.killTweensOf(activeStep);

            gsapEngine.fromTo(
                activeStep,

                {
                    opacity: 0,
                    y: 15
                },

                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    ease: "power2.out",
                    clearProps: "transform"
                }
            );

        } else if (activeStep) {

            activeStep.style.opacity = "1";
            activeStep.style.transform = "none";

        }

        refreshIcons();

    }

    /* =====================================================
       14. CONTINUE AND BACK BUTTONS
    ===================================================== */

    registrationForm.addEventListener("click", event => {

        const button = event.target.closest(
            "button[data-next], button[data-back]"
        );

        if (!button || !registrationForm.contains(button)) {
            return;
        }

        event.preventDefault();

        // CONTINUE BUTTON

        if (button.hasAttribute("data-next")) {

            const nextStep = Number(button.dataset.next);

            if (!Number.isInteger(nextStep)) {
                return;
            }

            if (!validateStep(currentStep)) {
                return;
            }

            if (nextStep === 3) {
                updateReview();
            }

            showStep(nextStep);
        }

        // BACK BUTTON

        if (button.hasAttribute("data-back")) {

            const previousStep = Number(button.dataset.back);

            if (!Number.isInteger(previousStep)) {
                return;
            }

            showStep(previousStep);
        }

    });

    /* =====================================================
       15. REVIEW GUEST DETAILS
    ===================================================== */

    function updateReview() {

        const reviewName = document.getElementById("reviewName");
        const reviewEmail = document.getElementById("reviewEmail");
        const reviewPhone = document.getElementById("reviewPhone");

        const reviewAdditionalGuests = document.getElementById("reviewAdditionalGuests");
        const reviewTotalAttendees = document.getElementById("reviewTotalAttendees");

        const reviewMessage = document.getElementById("reviewMessage");
        const reviewMessageContainer = document.getElementById("reviewMessageContainer");

        // Personal information

        if (reviewName) {
            reviewName.textContent =
                document.getElementById("guestName")?.value.trim() || "—";
        }

        if (reviewEmail) {
            reviewEmail.textContent =
                document.getElementById("guestEmail")?.value.trim() || "—";
        }

        if (reviewPhone) {
            reviewPhone.textContent =
                document.getElementById("guestPhone")?.value.trim() || "—";
        }

        // Attendance information

        if (reviewAdditionalGuests) {
            reviewAdditionalGuests.textContent = additionalGuestCount;
        }

        if (reviewTotalAttendees) {
            reviewTotalAttendees.textContent = additionalGuestCount + 1;
        }

        // Optional message

        const message =
            document.getElementById("guestMessage")?.value.trim() || "";

        if (reviewMessage) {
            reviewMessage.textContent = message || "No additional message";
        }

        if (reviewMessageContainer) {
            reviewMessageContainer.style.display =
                message ? "block" : "none";
        }

    }

    /* =====================================================
       16. SUPABASE REGISTRATION SUBMISSION
    ===================================================== */

    let isSubmitting = false;

    const submitButton = registrationForm.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    // Create an accessible submission status message.

    let submissionStatus = registrationForm.querySelector(
        ".registration-submit-status"
    );

    if (!submissionStatus) {

        submissionStatus = document.createElement("p");

        submissionStatus.className = "registration-submit-status";

        submissionStatus.setAttribute("role", "alert");
        submissionStatus.setAttribute("aria-live", "polite");

        submissionStatus.style.display = "none";
        submissionStatus.style.marginTop = "12px";
        submissionStatus.style.color = "#ffffff";
        submissionStatus.style.fontSize = "14px";
        submissionStatus.style.textAlign = "center";

        registrationForm.appendChild(submissionStatus);

    }

    function showSubmissionStatus(message, type = "error") {

        if (!submissionStatus) return;

        submissionStatus.textContent = message;
        submissionStatus.style.display = "block";

        submissionStatus.style.color =
            type === "success" ? "#d6b36a" : "#ff8585";

    }

    function clearSubmissionStatus() {

        if (!submissionStatus) return;

        submissionStatus.textContent = "";
        submissionStatus.style.display = "none";

    }

    function setSubmittingState(submitting) {

        isSubmitting = submitting;

        if (submitButton) {

            submitButton.disabled = submitting;

            if (submitButton.tagName === "BUTTON") {

                if (!submitButton.dataset.originalText) {
                    submitButton.dataset.originalText =
                        submitButton.textContent.trim();
                }

                submitButton.textContent = submitting
                    ? "Submitting Registration..."
                    : submitButton.dataset.originalText;

            } else if (submitButton.tagName === "INPUT") {

                if (!submitButton.dataset.originalText) {
                    submitButton.dataset.originalText =
                        submitButton.value;
                }

                submitButton.value = submitting
                    ? "Submitting Registration..."
                    : submitButton.dataset.originalText;

            }

        }

    }

    async function sendRegistrationToSupabase() {

        const registrationData = {

            name: guestName.value.trim(),

            email: guestEmail.value.trim(),

            phone: guestPhone.value.trim(),

            additionalGuests: additionalGuestCount,

            totalAttendees: additionalGuestCount + 1,

            message: guestMessage
                ? guestMessage.value.trim()
                : ""

        };

        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/fo-authority-registration`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                },

                body: JSON.stringify(registrationData)

            }
        );

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(
                "The server returned an invalid response. Please try again."
            );
        }

        if (!response.ok || !result.success) {

            throw new Error(
                result.error ||
                "Your registration could not be completed. Please try again."
            );

        }

        return result;

    }

    /* =====================================================
       17. FORM SUBMISSION
    ===================================================== */

    registrationForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (isSubmitting) return;

        clearSubmissionStatus();

        if (!validateStep(1)) {

            showStep(1);

            return;

        }

        if (!validateStep(2)) {

            showStep(2);

            return;

        }

        if (
            registrationConsent &&
            !registrationConsent.checked
        ) {

            registrationConsent.setCustomValidity(
                "Please confirm that your information is correct."
            );

            registrationConsent.reportValidity();

            registrationConsent.focus();

            return;

        }

        if (registrationConsent) {
            registrationConsent.setCustomValidity("");
        }

        updateReview();

        setSubmittingState(true);

        showSubmissionStatus(
            "Please wait while we complete your registration...",
            "success"
        );

        try {

            await sendRegistrationToSupabase();

            clearSubmissionStatus();

            // Hide registration steps only after successful response.

            formSteps.forEach(step => {
                step.classList.remove("active");
            });

            // Show success screen.

            if (formSuccess) {

                formSuccess.hidden = false;

                formSuccess.classList.add("active");

                const formProgress = document.querySelector(".form-progress");

                if (formProgress) {
                    formProgress.classList.add("registration-complete");
                }

                if (gsapEngine) {

                    gsapEngine.fromTo(
                        formSuccess,

                        {
                            opacity: 0,
                            y: 20
                        },

                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out"
                        }
                    );

                }

            }

            refreshIcons();

        } catch (error) {

            console.error("FO Authority registration error:", error);

            showSubmissionStatus(
                error.message ||
                "Something went wrong. Please check your connection and try again.",
                "error"
            );

            // Keep the guest on the review step so they can retry.

            showStep(3);

        } finally {

            setSubmittingState(false);

        }

    });

    /* =====================================================
       18. RETURN TO THE EXPERIENCE
    ===================================================== */

    if (returnButton) {

        returnButton.addEventListener("click", () => {

            registrationForm.reset();

            clearSubmissionStatus();

            setSubmittingState(false);

            // Reset additional guest counter.

            additionalGuestCount = 0;

            updateGuestCount();

            // Hide all registration steps.

            formSteps.forEach(step => {
                step.classList.remove("active");
            });

            // Hide success screen.

            if (formSuccess) {

                formSuccess.classList.remove("active");

                formSuccess.hidden = true;

            }

            // Reset progress styling.

            const formProgress = document.querySelector(".form-progress");

            if (formProgress) {
                formProgress.classList.remove("registration-complete");
            }

            // Clear field errors.

            registrationForm.querySelectorAll(".form-field").forEach(field => {

                field.classList.remove("has-error");

            });

            registrationForm.querySelectorAll(".field-error").forEach(error => {

                error.textContent = "";

            });

            registrationForm.querySelectorAll("[aria-invalid]").forEach(field => {

                field.removeAttribute("aria-invalid");

            });

            if (registrationConsent) {
                registrationConsent.setCustomValidity("");
            }

            showStep(1);

            switchSection("welcome");

        });

    }

    /* =====================================================
       19. INITIAL STATE
    ===================================================== */

    updateNavigation(currentSection);

    showStep(1);

    if (formSuccess) {
        formSuccess.hidden = true;
    }

    refreshIcons();

});
