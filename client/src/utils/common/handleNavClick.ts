export const handleNavClick = (sectionId: string) => {
  const navbarHeight = 76;

  if (window.location.pathname === "/") {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
    }
  }
};
