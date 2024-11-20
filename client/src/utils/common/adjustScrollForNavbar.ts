export const adjustScrollForNavbar = (el: HTMLElement) => {
  const navbarHeight = 76; // Adjust for your navbar height
  const sectionTop =
    el.getBoundingClientRect().top + window.scrollY - navbarHeight;

  window.scrollTo({ top: sectionTop, behavior: "smooth" });
};
