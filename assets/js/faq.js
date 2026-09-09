(function () {
  function initFaqAccordion() {
    const items = Array.from(document.querySelectorAll(".faq-sub-item"));

    items.forEach((item, index) => {
      const button = item.querySelector(".faq-sub-question");
      const answer = item.querySelector(".faq-sub-answer");

      if (!button || !answer) return;

      const answerId = answer.id || `faq-sub-answer-${index + 1}`;
      answer.id = answerId;
      button.setAttribute("aria-controls", answerId);
      button.setAttribute(
        "aria-expanded",
        item.classList.contains("is-open") ? "true" : "false",
      );

      button.addEventListener("click", () => {
        const isOpening = !item.classList.contains("is-open");

        items.forEach((otherItem) => {
          if (otherItem === item && isOpening) return;

          otherItem.classList.remove("is-open");
          otherItem
            .querySelector(".faq-sub-question")
            ?.setAttribute("aria-expanded", "false");
        });

        if (isOpening) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFaqAccordion, { once: true });
  } else {
    initFaqAccordion();
  }
})();
