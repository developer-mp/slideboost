export const handleNavClick = (
  sectionId: string,
  navigateToHome: () => void
) => {
  const navbarHeight = 76;

  if (sectionId === "home") {
    navigateToHome();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  } else if (window.location.pathname === "/") {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
    }
  } else {
    navigateToHome();
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop =
          section.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: sectionTop, behavior: "smooth" });
      }
    }, 0);
  }
};
