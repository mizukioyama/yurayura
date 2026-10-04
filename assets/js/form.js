/**
 * Contact Form
 * Client-side validation and accessible dialogs.
 */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const resultModal = document.getElementById("modal");
  const policyModal = document.getElementById("contactPolicyModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const typeCheckboxes = Array.from(contactForm.querySelectorAll('input[type="checkbox"][name="type"]'));
  const consentCheckbox = contactForm.querySelector('input[type="checkbox"][name="consent"]');
  const honeypot = contactForm.querySelector('input[name="website"]');
  const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"], .send-btn');
  const fields = ["subject", "name", "email", "message"].map((name) => contactForm.elements.namedItem(name));
  const allowedTypes = new Set(["展示について", "作品について", "購入について", "その他"]);
  const genericErrorMessage = "送信できませんでした。時間をおいて、もう一度お試しください。";
  const formReadyAt = performance.now();
  const minimumCompletionTime = 1000;
  const defaultButtonText = submitButton instanceof HTMLInputElement ? submitButton.value : submitButton?.textContent || "";
  let activeDialog = null;
  let returnFocusElement = null;
  let isSubmitting = false;
  const backgroundRoots = [
    document.getElementById("js-header"),
    document.getElementById("main"),
    document.getElementById("js-footer")
  ].filter(Boolean);

  if (!resultModal || !policyModal || !modalTitle || !modalMessage || !consentCheckbox || !honeypot || !submitButton || fields.some((field) => !(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement))) {
    console.warn("Contact form elements are incomplete; form submission is disabled.");
    return;
  }

  function focusableElements(dialog) {
    return Array.from(dialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element instanceof HTMLElement && !element.hasAttribute("hidden"));
  }

  function openDialog(dialog, preferredFocus, returnFocus = document.activeElement) {
    if (activeDialog && activeDialog !== dialog) closeDialog(false);
    returnFocusElement = returnFocus instanceof HTMLElement ? returnFocus : null;
    activeDialog = dialog;
    dialog.removeAttribute("inert");
    dialog.classList.add("active");
    dialog.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
    document.documentElement.classList.add("is-contact-modal-open");
    backgroundRoots.forEach((root) => root.setAttribute("inert", ""));
    const target = preferredFocus instanceof HTMLElement ? preferredFocus : focusableElements(dialog)[0];
    (target || dialog).focus({ preventScroll: true });
  }

  function openResult(title, message, returnFocus = document.activeElement) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    openDialog(resultModal, resultModal.querySelector("[data-form-modal-close]"), returnFocus);
  }

  function closeDialog(restoreFocus = true) {
    const dialog = activeDialog;
    if (!dialog) return;
    dialog.classList.remove("active");
    dialog.setAttribute("aria-hidden", "true");
    dialog.setAttribute("inert", "");
    activeDialog = null;
    document.body.classList.remove("is-modal-open");
    document.documentElement.classList.remove("is-contact-modal-open");
    backgroundRoots.forEach((root) => root.removeAttribute("inert"));
    if (restoreFocus && returnFocusElement?.isConnected) returnFocusElement.focus();
    returnFocusElement = null;
  }

  document.querySelectorAll("[data-open-contact-policy]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openDialog(policyModal, policyModal.querySelector("[data-form-modal-close]"), trigger);
    });
  });

  [resultModal, policyModal].forEach((dialog) => {
    dialog.querySelectorAll("[data-form-modal-close]").forEach((button) => {
      button.addEventListener("click", () => closeDialog());
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!activeDialog) return;
    if (event.key === "Escape") {
      closeDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusableElements(activeDialog);
    if (items.length === 0) {
      event.preventDefault();
      activeDialog.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function selectedTypes() {
    return typeCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  }

  function setSubmitting(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.setAttribute("aria-busy", String(isLoading));
    const text = isLoading ? "送信中..." : defaultButtonText;
    if (submitButton instanceof HTMLInputElement) submitButton.value = text;
    else submitButton.textContent = text;
  }

  function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Promise.resolve({ status: response.ok ? "success" : "error", message: "" });
    }
    return response.json().catch(() => ({ status: "error", message: "" }));
  }

  function validateForm() {
    const checkedTypes = selectedTypes();
    typeCheckboxes.forEach((checkbox) => checkbox.setAttribute("aria-invalid", String(checkedTypes.length === 0)));
    if (checkedTypes.length === 0 || checkedTypes.some((type) => !allowedTypes.has(type))) {
      openResult("入力内容をご確認ください", "お問い合わせ種別を選択してください。", typeCheckboxes[0] || submitButton);
      return null;
    }
    if (!consentCheckbox.checked) {
      openResult("同意が必要です", "個人情報の取り扱いをご確認のうえ、同意してください。", consentCheckbox);
      return null;
    }
    if (honeypot.value.trim() !== "") {
      openResult("送信できませんでした", genericErrorMessage, submitButton);
      return null;
    }

    fields.forEach((field) => {
      field.value = field.value.trim();
      field.setCustomValidity("");
      if (field.value.length > field.maxLength) {
        field.setCustomValidity("入力できる文字数を超えています。");
      }
    });
    if (fields.some((field) => field.value.length === 0)) {
      contactForm.reportValidity();
      return null;
    }
    const emailField = contactForm.elements.namedItem("email");
    if (!(emailField instanceof HTMLInputElement) || !emailField.validity.valid) {
      contactForm.reportValidity();
      return null;
    }
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return null;
    }
    if (performance.now() - formReadyAt < minimumCompletionTime) {
      openResult("入力内容をご確認ください", genericErrorMessage, submitButton);
      return null;
    }
    return checkedTypes;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const checkedTypes = validateForm();
    if (!checkedTypes) return;

    isSubmitting = true;
    setSubmitting(true);
    try {
      const formData = new FormData(contactForm);
      formData.set("type", checkedTypes.join("、"));
      const response = await fetch(contactForm.action, {
        method: (contactForm.method || "POST").toUpperCase(),
        body: formData,
        headers: { Accept: "application/json" }
      });
      const result = await parseResponse(response);
      if (!response.ok || result.status !== "success") throw new Error("Contact submission failed");

      contactForm.reset();
      typeCheckboxes.forEach((checkbox) => checkbox.setAttribute("aria-invalid", "false"));
      openResult(
        "お問い合わせを受け付けました",
        "お問い合わせありがとうございます。送信内容を受け付けました。内容を確認のうえ、必要なご連絡がある場合にご連絡いたします。",
        submitButton
      );
    } catch (error) {
      console.error("Contact submission failed.", error);
      openResult("送信できませんでした", genericErrorMessage, submitButton);
    } finally {
      isSubmitting = false;
      setSubmitting(false);
    }
  });
});