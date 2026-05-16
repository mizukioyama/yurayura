document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-list-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", function () {
      item.classList.toggle("is-open");
    });
  });
});