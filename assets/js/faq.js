(function () {
  function initAccordion({
    itemSelector,
    buttonSelector,
    answerSelector,
    answerIdPrefix,
    resetNestedItems = false,
  }) {
    const items = Array.from(document.querySelectorAll(itemSelector));

    items.forEach((item, index) => {
      const button = item.querySelector(buttonSelector);
      const answer = item.querySelector(answerSelector);

      if (!button || !answer) return;

      const answerId = answer.id || `${answerIdPrefix}-${index + 1}`;
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
            .querySelector(buttonSelector)
            ?.setAttribute("aria-expanded", "false");

          if (resetNestedItems) {
            otherItem.querySelectorAll(".faq-sub-item").forEach((subItem) => {
              subItem.classList.remove("is-open");
              subItem
                .querySelector(".faq-sub-question")
                ?.setAttribute("aria-expanded", "false");
            });
          }
        });

        if (isOpening) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initFaqAccordion() {
    initAccordion({
      itemSelector: ".faq-list-item",
      buttonSelector: ".faq-question",
      answerSelector: ".faq-answer",
      answerIdPrefix: "faq-answer",
      resetNestedItems: true,
    });

    initAccordion({
      itemSelector: ".faq-sub-item",
      buttonSelector: ".faq-sub-question",
      answerSelector: ".faq-sub-answer",
      answerIdPrefix: "faq-sub-answer",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFaqAccordion, { once: true });
  } else {
    initFaqAccordion();
  }
})();
