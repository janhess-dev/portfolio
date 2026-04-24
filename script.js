const $ = (selector) => document.querySelector(selector);
const byId = (id) => document.getElementById(id);

const projects = byId("projects");
const contact = byId("contact");
const btn = byId("backToTop");
const modal = byId("imageModal");
const modalImg = byId("modalImg");
const backLink = $(".back-link");
const projectDetail = $(".project-detail");

function scrollToSection(section, offset = 80) {
    if (!section) return;

    const y = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: y,
        behavior: "smooth"
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
            behavior: "smooth"
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

        projectDetail.classList.remove("page-enter");
        projectDetail.classList.add("page-exit-back");

        setTimeout(() => {
            window.location.href = backLink.href;
        }, 420);
    });
}