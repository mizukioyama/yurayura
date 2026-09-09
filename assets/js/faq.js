(function () {
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-list-item");

    faqItems.forEach((item, index) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!button || !answer) return;

      const answerId = answer.id || `faq-answer-${index + 1}`;
      answer.id = answerId;
      button.setAttribute("aria-controls", answerId);
      button.setAttribute(
        "aria-expanded",
        item.classList.contains("is-open") ? "true" : "false",
      );

      button.addEventListener("click", () => {
        const isOpening = !item.classList.contains("is-open");

        faqItems.forEach((otherItem) => {
          const otherButton = otherItem.querySelector(".faq-question");

          otherItem.classList.remove("is-open");
          otherButton?.setAttribute("aria-expanded", "false");
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
