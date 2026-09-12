class LiquidButton extends HTMLElement {

  static get observedAttributes() {
    return [
      "text",
      "href",
      "size",
      "theme",
      "fluid"
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {

    const rawText =
      this.getAttribute("text") ||
      this.textContent ||
      "Button";

    const arrowMatch = rawText.match(/(\s*)([→↗])$/);
    const labelText = arrowMatch
      ? rawText.slice(0, arrowMatch.index).trimEnd()
      : rawText;
    const arrow = arrowMatch ? arrowMatch[2] : "";

    const href =
      this.getAttribute("href");

    const size =
      this.getAttribute("size") || "md";

    const fluid =
      this.hasAttribute("fluid");

    const theme =
      this.getAttribute("theme") || "light";

    const tag = href ? "a" : "button";

    this.shadowRoot.innerHTML = `

<style>

:host{

  --radius:42px;

  --blur:30px;

  --duration:.4s;

  display:inline-block;

}

:host([fluid]){

  display:block;

  width:100%;

  max-width:100%;

  margin:0;

}

@media screen and (max-width:699px){

  :host([fluid]){

    width:100%;

  }

}

.wrapper{

  position:relative;

  display:flex;

  justify-content:center;
  align-items:center;

  overflow:hidden;

  cursor:pointer;

  border:none;

  text-decoration:none;

  border-radius:var(--radius);

  color:${theme === "dark" ? "#fff" : "var(--color-txt, #303a05)"};

  background:transparent;

  transition:
    transform var(--duration),
    background-color var(--duration),
    color var(--duration);

}

.wrapper::before{
  display:none;
}

.wrapper:hover{

  color:#f8faec;
  background:var(--color-shadow-green, #3c4606);

  transform:
    translateY(-2px);
}

.wrapper:focus-visible{

  color:#f8faec;
  background:var(--color-shadow-green, #3c4606);
  outline:2px solid currentColor;
  outline-offset:4px;
}

.sm{

  width:180px;
  height:40px;
  font-size:1rem;
}

.md{
  width:${fluid ? "100%" : "280px"};
  height:32px;
  font-size:1.2rem;
}

.lg{
  width:420px;
  height:140px;
  font-size:2.5rem;
}

.label{

  position:relative;

  z-index:5;

  font-weight:300;

  letter-spacing:.05em;

  display:inline-flex;
  align-items:center;
  gap:.55em;
}

.arrow{
  display:inline-block;
  transition:transform var(--duration) ease;
}

.wrapper:hover .arrow,
.wrapper:focus-visible .arrow{
  transform:translateX(.35em);
}

.highlight{
  display:none;
}

.caustics{
  display:none;
}

.noise{
  display:none;
}

</style>

<${tag}
class="wrapper ${size}"
${href ? `href="${href}"` : ""}>

<div class="highlight"></div>

<div class="caustics"></div>

<div class="noise"></div>

<span class="label">
${labelText}${arrow ? `<span class="arrow">${arrow}</span>` : ""}
</span>

</${tag}>
`;

    const wrapper =
      this.shadowRoot.querySelector(".wrapper");

    wrapper.addEventListener(
      "mousemove",
      e => {

        const rect =
          wrapper.getBoundingClientRect();

        const x =
          ((e.clientX - rect.left)
          / rect.width) * 100;

        const y =
          ((e.clientY - rect.top)
          / rect.height) * 100;

        wrapper.style.setProperty(
          "--mx",
          `${x}%`
        );

        wrapper.style.setProperty(
          "--my",
          `${y}%`
        );

      }
    );
  }
}

customElements.define(
  "liquid-button",
  LiquidButton
);

function bindLiquidControls() {
  document.querySelectorAll("button:not(.js-menu)").forEach((control) => {
    control.classList.add("liquid-control");

    if (control.classList.contains("gallery-filter")) {
      control.classList.add("liquid-control--compact");
    }

    if (control.classList.contains("faq-sub-question")) {
      control.classList.add("liquid-control--accordion");
    }

    if (control.classList.contains("modal-close")) {
      control.classList.add("liquid-control--icon");
    }

    if (control.dataset.liquidBound === "true") return;

    control.dataset.liquidBound = "true";
    control.addEventListener("pointermove", (event) => {
      const rect = control.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      control.style.setProperty("--mx", `${x}%`);
      control.style.setProperty("--my", `${y}%`);
    });
    control.addEventListener("pointerleave", () => {
      control.style.removeProperty("--mx");
      control.style.removeProperty("--my");
    });
  });
}

window.bindLiquidControls = bindLiquidControls;
document.addEventListener("DOMContentLoaded", bindLiquidControls);
