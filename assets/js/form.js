/**
 * ==========================================
 * Contact Form
 * 複数チェックボックス・モーダル対応
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * ==========================
   * 要素取得
   * ==========================
   */

  const contactForm = document.getElementById("contactForm");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalClose = document.getElementById("modalClose");
  const modalButton = document.getElementById("modalButton");

  if (!contactForm) {
    console.warn("お問い合わせフォームが見つかりません");
    return;
  }

  if (
    !modal ||
    !modalTitle ||
    !modalMessage ||
    !modalClose ||
    !modalButton
  ) {
    console.warn("モーダルに必要な要素が見つかりません");
    return;
  }

  const typeCheckboxes = Array.from(
    contactForm.querySelectorAll(
      'input[type="checkbox"][name="type"]'
    )
  );

  const submitButton = contactForm.querySelector(
    'button[type="submit"], input[type="submit"], .send-btn'
  );

  if (typeCheckboxes.length === 0) {
    console.warn(
      'name="type"のチェックボックスが見つかりません'
    );
  }

  if (!submitButton) {
    console.warn("送信ボタンが見つかりません");
    return;
  }

  /**
   * 送信ボタンの初期表示を保存
   */

  const defaultButtonText =
    submitButton instanceof HTMLInputElement
      ? submitButton.value
      : submitButton.textContent;

  let lastFocusedElement = null;
  let isSubmitting = false;

  /**
   * ==========================
   * モーダルを開く
   * ==========================
   */

  function openModal(title, message) {
    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("is-modal-open");

    modalButton.focus();
  }

  /**
   * ==========================
   * モーダルを閉じる
   * ==========================
   */

  function closeModal() {
    if (!modal.classList.contains("active")) {
      return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("is-modal-open");

    lastFocusedElement?.focus();
    lastFocusedElement = null;
  }

  /**
   * ==========================
   * 選択されたお問い合わせ種別
   * ==========================
   */

  function getCheckedTypes() {
    return typeCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  /**
   * ==========================
   * チェックボックス検証
   * 複数のうち1つ以上を必須にする
   * ==========================
   */

  function validateTypeCheckboxes() {
    const checkedTypes = getCheckedTypes();
    const isValid = checkedTypes.length > 0;

    typeCheckboxes.forEach((checkbox) => {
      checkbox.setAttribute(
        "aria-invalid",
        String(!isValid)
      );
    });

    return isValid;
  }

  /**
   * ==========================
   * 送信ボタン状態
   * ==========================
   */

  function setSubmittingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.setAttribute(
      "aria-busy",
      String(isLoading)
    );

    const buttonText = isLoading
      ? "送信中..."
      : defaultButtonText;

    if (submitButton instanceof HTMLInputElement) {
      submitButton.value = buttonText;
    } else {
      submitButton.textContent = buttonText;
    }
  }

  /**
   * ==========================
   * レスポンスを安全に解析
   * ==========================
   */

  async function parseResponse(response) {
    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return {
        status: response.ok ? "success" : "error",
        message: "",
      };
    }

    try {
      return await response.json();
    } catch {
      return {
        status: "error",
        message:
          "サーバーから正しい形式の応答を受信できませんでした。",
      };
    }
  }

  /**
   * ==========================
   * モーダル操作
   * ==========================
   */

  modalClose.addEventListener("click", closeModal);
  modalButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("active")
    ) {
      closeModal();
    }
  });

  /**
   * ==========================
   * チェック状態変更
   * ==========================
   */

  typeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (getCheckedTypes().length > 0) {
        typeCheckboxes.forEach((item) => {
          item.setAttribute("aria-invalid", "false");
        });
      }
    });
  });

  /**
   * ==========================
   * フォーム送信
   * ==========================
   */

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    /*
     * 二重送信防止
     */

    if (isSubmitting) {
      return;
    }

    /*
     * お問い合わせ種別
     * 1つ以上の選択を必須にする
     */

    if (!validateTypeCheckboxes()) {
      openModal(
        "入力エラー",
        "お問い合わせ種別を1つ以上選択してください。"
      );

      typeCheckboxes[0]?.focus();
      return;
    }

    /*
     * required、メール形式など
     * HTML標準の入力検証
     */

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const checkedTypes = getCheckedTypes();
    const formData = new FormData(contactForm);

    /*
     * 複数のtypeを1つの文字列にまとめる
     */

    formData.set("type", checkedTypes.join("、"));

    isSubmitting = true;
    setSubmittingState(true);

    try {
      const response = await fetch(contactForm.action, {
        method: (
          contactForm.method || "POST"
        ).toUpperCase(),
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ||
            `送信に失敗しました。Status: ${response.status}`
        );
      }

      if (result.status === "success") {
        contactForm.reset();

        typeCheckboxes.forEach((checkbox) => {
          checkbox.setAttribute(
            "aria-invalid",
            "false"
          );
        });

        openModal(
          "送信完了",
          "お問い合わせありがとうございます。内容を確認後、ご連絡いたします。自動返信メールもご確認ください。"
        );

        return;
      }

      openModal(
        "送信失敗",
        result.message ||
          "送信中にエラーが発生しました。"
      );
    } catch (error) {
      console.error("お問い合わせ送信エラー:", error);

      openModal(
        "通信エラー",
        error instanceof Error && error.message
          ? error.message
          : "送信に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      isSubmitting = false;
      setSubmittingState(false);
    }
  });
});
