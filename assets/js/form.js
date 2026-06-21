const contactForm = document.getElementById("contactForm");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

const modalClose = document.getElementById("modalClose");
const modalButton = document.getElementById("modalButton");

function openModal(title, message) {
   modalTitle.textContent = title;
   modalMessage.textContent = message;
   modal.classList.add("active");
}

function closeModal() {
   modal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);
modalButton.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
   if (e.target === modal) {
      closeModal();
   }
});

document.addEventListener("keydown", (e) => {
   if (e.key === "Escape") {
      closeModal();
   }
});

contactForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   const checkedTypes = [
      ...contactForm.querySelectorAll('input[name="type"]:checked')
   ].map((item) => item.value);

   if (checkedTypes.length === 0) {
      openModal(
         "入力エラー",
         "お問い合わせ種別を1つ以上選択してください。"
      );
      return;
   }

   const formData = new FormData(contactForm);

   formData.delete("type");
   formData.append("type", checkedTypes.join("、"));

   const submitBtn = contactForm.querySelector(".send-btn");

   submitBtn.disabled = true;
   submitBtn.textContent = "送信中...";

   try {
      const response = await fetch(contactForm.action, {
         method: "POST",
         body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
         openModal(
            "送信完了",
            "お問い合わせありがとうございます。内容を確認後、ご連絡いたします。自動返信メールもご確認ください。"
         );

         contactForm.reset();
      } else {
         openModal(
            "送信失敗",
            result.message || "送信中にエラーが発生しました。"
         );
      }

   } catch (error) {
      console.error(error);

      openModal(
         "通信エラー",
         "送信に失敗しました。時間をおいて再度お試しください。"
      );

   } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send";
   }
});