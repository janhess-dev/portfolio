const $ = (selector) => document.querySelector(selector);
const byId = (id) => document.getElementById(id);

const projects = byId("projects");
const contact = byId("contact");
const btn = byId("backToTop");
const modal = byId("imageModal");
const modalImg = byId("modalImg");
const backLink = $(".back-link");
const projectDetail = $(".project-detail");
const langDe = byId("langDe");
const langEn = byId("langEn");
const hasTranslations = typeof translations !== "undefined";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const getScrollBehavior = () => {
    return prefersReducedMotion.matches ? "auto" : "smooth";
};

function scrollToSection(section, offset = 80) {
    if (!section) return;

    const y = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: y,
        behavior: getScrollBehavior()
    });
}

function addScrollLink(id, target) {
    const link = byId(id);
    if (!link) return;

    link.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(target);
    });
}

addScrollLink("goProjects", projects);
addScrollLink("goContact", contact);
addScrollLink("goStatusContact", contact);

if (btn) {
    window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 400);
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: getScrollBehavior()
        });
    });
}

if (modal && modalImg) {
    const closeModal = () => {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".zoomable-image").forEach((img) => {
        img.addEventListener("click", () => {
            modal.classList.add("show");
            modalImg.src = img.dataset.full || img.src;
            modalImg.alt = img.alt || "";
            document.body.style.overflow = "hidden";
        });
    });

    modal.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });
}

if (backLink && projectDetail) {
    backLink.addEventListener("click", (e) => {
        e.preventDefault();

        if (prefersReducedMotion.matches) {
            window.location.href = backLink.href;
        } else {
            projectDetail.classList.remove("page-enter");
            projectDetail.classList.add("page-exit-back");

            setTimeout(() => {
                window.location.href = backLink.href;
            }, 420);
        }
    });
}

/// Language Localization / Function
function setLanguage(lang) {
    document.documentElement.lang = lang;

    if (langDe && langEn && lang === "de") {
        langDe.classList.add("is-active");
        langEn.classList.remove("is-active");
    } else if (langDe && langEn) {
        langEn.classList.add("is-active");
        langDe.classList.remove("is-active");
    }

    if (!hasTranslations || !translations[lang]) {
        localStorage.setItem("language", lang);
        return;
    }

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        const text = translations[lang][key];

        if (typeof text === "string") {
            element.textContent = text;
        }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
        const key = element.dataset.i18nHtml;
        const text = translations[lang][key];

        if (typeof text === "string") {
            element.innerHTML = text;
        }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
        const key = element.dataset.i18nAlt;
        const text = translations[lang][key];

        if (typeof text === "string") {
            element.alt = text;
        }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        const key = element.dataset.i18nAriaLabel;
        const text = translations[lang][key];

        if (typeof text === "string") {
            element.setAttribute("aria-label", text);
        }
    });

    localStorage.setItem("language", lang);
}

if (langDe) {
    langDe.addEventListener("click", () => {
        setLanguage("de");
    });
}

if (langEn) {
    langEn.addEventListener("click", () => {
        setLanguage("en");
    });
}

const savedLanguage = localStorage.getItem("language") || "de";
setLanguage(savedLanguage);
