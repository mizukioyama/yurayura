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

    const arrowMatch = rawText.match(/(\s*)([→↗＞])$/);
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

  --light-bg:
    rgba(255,255,255,.18);

  --dark-bg:
    rgba(25,25,25,.18);

  --btn-color: #F8FAEC;

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

  backdrop-filter:
    blur(var(--blur))
    saturate(180%);

  -webkit-backdrop-filter:
    blur(var(--blur))
    saturate(180%);

  background:
    ${theme === "dark"
      ? "var(--dark-bg)"
      : "var(--light-bg)"};

  transition:
    transform var(--duration),
    background-color var(--duration),
    color var(--duration),
    box-shadow var(--duration);

  box-shadow:
    0 25px 40px rgba(0,0,0,.08),
    inset 0 1px 1px rgba(255,255,255,.95),
    inset 0 -10px 20px rgba(0,0,0,.05);

}

.wrapper::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  padding:2px;
  background:linear-gradient(
    180deg,
    rgba(255,255,255,.95),
    rgba(255,255,255,.3),
    rgba(255,255,255,.05)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  pointer-events:none;
}

.wrapper:hover{

  color:#f8faec;
  background:rgba(60,70,6,.82);

  transform:
    translateY(-2px);
}

.wrapper:focus-visible{

  color:#f8faec;
  background:rgba(60,70,6,.82);
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
  position:absolute;
  inset:-50%;
  background:radial-gradient(
    circle at var(--mx,50%) var(--my,50%),
    rgba(255,255,255,.95),
    rgba(255,255,255,.3) 20%,
    transparent 50%
  );
  filter:blur(20px);
  pointer-events:none;
}

.caustics{
  position:absolute;
  bottom:-20px;
  left:10%;
  width:80%;
  height:60px;
  background:radial-gradient(ellipse, rgba(255,255,255,.9), transparent);
  filter:blur(15px);
  opacity:.8;
}

.noise{
  position:absolute;
  inset:0;
  opacity:.03;
  background-image:radial-gradient(#fff 1px, transparent 1px);
  background-size:4px 4px;
  mix-blend-mode:overlay;
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
  document.querySelectorAll("button:not(.js-menu):not(.faq-sub-question)").forEach((control) => {
    control.classList.add("liquid-control");

    if (control.classList.contains("gallery-filter")) {
      control.classList.add("liquid-control--compact");
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
