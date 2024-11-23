export const adjustScrollForNavbar = (el: HTMLElement) => {
  const navbarHeight = 76;
  const sectionTop =
    el.getBoundingClientRect().top + window.scrollY - navbarHeight;

  window.scrollTo({ top: sectionTop, behavior: "smooth" });
};
