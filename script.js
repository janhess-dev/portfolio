    const projects = document.getElementById("projects");
    const contact = document.getElementById("contact");
    const goProjects = document.getElementById("goProjects");
    const goContact = document.getElementById("goContact");
    const btn = document.getElementById("backToTop");
    const goStatusContact = document.getElementById("goStatusContact");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const backLink = document.querySelector(".back-link");
    const projectDetail = document.querySelector(".project-detail");

    function scrollToSection(section, offset = 80) {
            const y = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: y,
    behavior: "smooth"
            });
        }

if (goProjects) {
    goProjects.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(projects, 80);
    });
}

if (goContact) {
    goContact.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(contact, 80);
    });
}

if (btn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

if (goStatusContact) {
    goStatusContact.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(contact, 80);
    });
}

if (modal && modalImg) {
    document.querySelectorAll(".zoomable-image").forEach(img => {
        img.addEventListener("click", () => {
            modal.classList.add("show");
            modalImg.src = img.dataset.full || img.src;
            modalImg.alt = img.alt;
            document.body.style.overflow = "hidden";
        });
    });

    modal.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            modal.classList.remove("show");
            document.body.style.overflow = "";
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