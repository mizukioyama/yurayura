/* Application form for the current recruitment.
 *
 * Fail-closed: the form stays hidden until the shared recruitment
 * state (exhibition-state.js + exhibitions.json) reports "open"
 * AND a verified receiver endpoint is configured below. The
 * receiver also enforces the recruitment window server-side;
 * this display gate is not the deadline control.
 *
 * Stage 2 (done 2026-11-21): APPLICATION_ENDPOINT is the deployed
 * application-only Google Apps Script web-app URL (/exec), and
 * recruitment.receiverVerified is true in exhibitions.json. The
 * receiver was verified live before the window: a pre-window POST
 * returns the server-side "before opening" error, so nothing is
 * accepted until 2026-11-28T11:00+09:00.
 */
(function () {
  "use strict";
  var APPLICATION_ENDPOINT = "https://script.google.com/macros/s/AKfycbxd5YXXw9f6T85w6GD_fm3sVOzwst348OQ5W0p8O5KRxxINXhU5suCY_hhkqFQfmK8DNQ/exec";

  document.addEventListener("DOMContentLoaded", async function () {
    var root = document.querySelector("[data-application]");
    if (!root) return;
    var notice = root.querySelector("[data-application-notice]");
    var wrap = root.querySelector("[data-application-form-wrap]");
    var form = root.querySelector("#applicationForm");
    if (!notice || !wrap || !form) return;
    if (APPLICATION_ENDPOINT) form.dataset.applicationEndpoint = APPLICATION_ENDPOINT;

    var view;
    try {
      if (!window.YurayuraState) throw new Error("state unavailable");
      var response = await fetch("./assets/data/exhibitions.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("event data unavailable");
      view = window.YurayuraState.recruitmentView(await response.json());
    } catch (error) {
      notice.textContent = "募集状況を確認できないため、受付中のご案内を停止しています。時間をおいて再読み込みしてください。";
      return;
    }

    var previewOnly = false;
    if (view.state === "upcoming") {
      if (!form.dataset.applicationEndpoint) {
        notice.textContent = "出展申し込みの受付は2026年11月28日 11:00に開始します。受付期間は2027年1月15日 20:00まで（日本時間・JST）です。";
        return;
      }
      // Display-only preview before the window opens (organizer
      // request, 2026-11-21): the form is shown on the public page
      // so it can be checked, but the send button stays disabled
      // and no submission is made. The receiver also rejects
      // early submissions server-side. From 2026-11-28T11:00+09:00
      // the state becomes "open" and the same code accepts real
      // applications with no further change.
      previewOnly = true;
      notice.textContent = "出展申し込みの受付は2026年11月28日 11:00に開始します。現在はフォームの表示確認用で、送信はできません。受付期間は2027年1月15日 20:00まで（日本時間・JST）です。";
    }
    if (view.state === "closed") {
      notice.textContent = "第2回の申込受付は終了しました。";
      return;
    }
    if (view.state !== "open" && !previewOnly) {
      notice.textContent = "現在、出展申し込みは受け付けていません。受付期間は2026年11月28日 11:00〜2027年1月15日 20:00（日本時間・JST）です。";
      return;
    }
    if (!form.dataset.applicationEndpoint) {
      // Recruitment window is open but the receiver is not wired
      // yet: never present a form that cannot be submitted.
      notice.textContent = "受付準備中です。申込フォームの準備が整うまで、もうしばらくお待ちください。";
      return;
    }
    if (!previewOnly) {
      notice.textContent = "出展者を募集しています。受付期間は2027年1月15日 20:00まで（日本時間・JST）です。下記のフォームからお申し込みください。";
    }
    wrap.hidden = false;

    var confirmSection = root.querySelector("#application-confirm");
    var completeSection = root.querySelector("#application-complete");
    var valuesList = root.querySelector("#application-values");
    var errorBox = root.querySelector("#application-error");
    var reviewButton = root.querySelector("#application-review");
    var editButton = root.querySelector("#application-edit");
    var sendButton = root.querySelector("#application-send");
    var honeypot = form.querySelector('input[name="website"]');
    var consent = form.querySelector('input[name="consent"]');
    var formReadyAt = performance.now();
    var sending = false;

    function enter(el) {
      el.classList.remove("application-enter");
      void el.offsetWidth;
      el.classList.add("application-enter");
    }

    function composeChoices(name, hiddenId) {
      var hidden = form.querySelector(hiddenId);
      var chosen = Array.from(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (el) { return el.value; });
      hidden.value = chosen.join("、");
      return chosen;
    }

    function composeWorks() {
      var count = form.querySelector("#application-works-count").value;
      var size = form.querySelector('input[name="sizeChoice"]:checked');
      var hidden = form.querySelector("#application-works");
      hidden.value = count && size ? count + "（" + size.value + "）" : "";
      return hidden.value;
    }

    reviewButton.addEventListener("click", function () {
      var genre = composeChoices("genreChoice", "#application-genre");
      composeChoices("formatChoice", "#application-format");
      composeChoices("deliveryChoice", "#application-delivery");
      var works = composeWorks();
      if (!genre.length) {
        errorBox.textContent = "作品ジャンルを選択してください。";
        form.querySelector('input[name="genreChoice"]').focus();
        return;
      }
      if (!works) {
        errorBox.textContent = "予定作品数とサイズの目安を選択してください。";
        form.querySelector("#application-works-count").focus();
        return;
      }
      var invalid = Array.from(form.querySelectorAll("input, textarea")).filter(function (el) { return !el.checkValidity(); });
      form.querySelectorAll("input, textarea").forEach(function (el) {
        el.setAttribute("aria-invalid", String(invalid.includes(el)));
      });
      if (!consent.checked) {
        errorBox.textContent = "個人情報の取り扱いを確認し、同意してください。";
        consent.focus();
        return;
      }
      if (invalid.length) {
        errorBox.textContent = "必須項目と入力形式を確認してください。";
        invalid[0].focus();
        return;
      }
      errorBox.textContent = "";
      valuesList.replaceChildren();
      form.querySelectorAll("input:not([type=checkbox]), textarea").forEach(function (el) {
        if (el.name === "website") return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        var dt = document.createElement("dt");
        var fallbackLabels = { format: "展示形式", genre: "作品ジャンル", works: "予定作品数・サイズ", delivery: "搬入方法の希望" };
        dt.textContent = label ? label.textContent : (fallbackLabels[el.name] || el.name);
        var dd = document.createElement("dd");
        dd.textContent = el.value || "未入力";
        valuesList.append(dt, dd);
      });
      form.hidden = true;
      confirmSection.hidden = false;
      enter(confirmSection);
      confirmSection.focus();
    });

    editButton.addEventListener("click", function () {
      confirmSection.hidden = true;
      form.hidden = false;
      enter(form);
      form.querySelector("input").focus();
    });

    if (previewOnly) {
      sendButton.disabled = true;
      sendButton.textContent = "送信は11月28日 11:00から";
    }

    sendButton.addEventListener("click", async function () {
      if (previewOnly || sending) return;
      if (honeypot.value.trim() !== "" || performance.now() - formReadyAt < 1000) {
        errorBox.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
        confirmSection.hidden = true;
        form.hidden = false;
        return;
      }
      sending = true;
      sendButton.disabled = true;
      sendButton.textContent = "送信中...";
      try {
        var body = new FormData(form);
        ["genreChoice", "formatChoice", "sizeChoice", "deliveryChoice"].forEach(function (key) { body.delete(key); });
        var response = await fetch(form.dataset.applicationEndpoint, {
          method: "POST",
          body: body,
          headers: { Accept: "application/json" }
        });
        var result = await response.json().catch(function () { return { status: "error" }; });
        if (!response.ok || result.status !== "success") throw new Error("submission failed");
        confirmSection.hidden = true;
        completeSection.hidden = false;
        enter(completeSection);
        completeSection.focus();
        form.reset();
      } catch (error) {
        sending = false;
        sendButton.disabled = false;
        sendButton.textContent = "この内容で申し込む";
        errorBox.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
        confirmSection.hidden = true;
        form.hidden = false;
      }
    });
  });
})();
