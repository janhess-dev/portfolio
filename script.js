    const projects = document.getElementById("projects");
    const contact = document.getElementById("contact");
    const goProjects = document.getElementById("goProjects");
    const goContact = document.getElementById("goContact");
    const btn = document.getElementById("backToTop");
    const goStatusContact = document.getElementById("goStatusContact");

    function scrollToSection(section, offset = 80) {
            const y = section.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: y,
    behavior: "smooth"
            });
        }

        goProjects.addEventListener("click", (e) => {
        e.preventDefault();
    scrollToSection(projects, 80);
        });

        goContact.addEventListener("click", (e) => {
        e.preventDefault();
    scrollToSection(contact, 80);
        });

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

        goStatusContact.addEventListener("click", (e) => {
        e.preventDefault();
    scrollToSection(contact, 80);
        });