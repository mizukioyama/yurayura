(() => {
  const artSelector = "[data-art-protect]";

  function protectedTarget(event) {
    return event.target instanceof Element ? event.target.closest(artSelector) : null;
  }

  function isArtistName(event) {
    return event.target instanceof Element && Boolean(event.target.closest(".card__btn"));
  }

  document.addEventListener("contextmenu", (event) => {
    const art = protectedTarget(event);
    if (!art || (art.matches(".card__link") && isArtistName(event))) return;
    event.preventDefault();
  });

  document.addEventListener("dragstart", (event) => {
    const art = protectedTarget(event);
    if (!art || (art.matches(".card__link") && isArtistName(event))) return;
    if (event.target instanceof HTMLImageElement || art.matches(".card__link")) event.preventDefault();
  });

  document.addEventListener("selectstart", (event) => {
    if (event.target instanceof HTMLImageElement && event.target.closest(artSelector)) event.preventDefault();
  });

  document.querySelectorAll("img[data-art-protect]").forEach((image) => {
    image.draggable = false;
  });
})();