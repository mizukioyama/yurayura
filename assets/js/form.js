const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const checkedTypes = [...contactForm.querySelectorAll('input[name="type"]:checked')]
    .map((item) => item.value);

  if (checkedTypes.length === 0) {
    formMessage.textContent = "お問い合わせ種別を1つ以上選択してください。";
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
      formMessage.textContent = "送信が完了しました。自動返信メールをご確認ください。";
      contactForm.reset();
    } else {
      formMessage.textContent = "送信エラー：" + result.message;
    }
  } catch (error) {
    formMessage.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send";
  }
});