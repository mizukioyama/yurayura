class LiquidButton extends HTMLElement {

  static get observedAttributes() {
    return [
      "text",
      "href",
      "size",
      "theme"
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

    const text =
      this.getAttribute("text") ||
      this.textContent ||
      "Button";

    const href =
      this.getAttribute("href");

    const size =
      this.getAttribute("size") || "md";

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

  color:${theme === "dark" ? "#fff" : "var(--btn-color)"};

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
    box-shadow var(--duration);

  box-shadow:

    0 25px 40px
    rgba(0,0,0,.08),

    inset 0 1px 1px
    rgba(255,255,255,.95),

    inset 0 -10px 20px
    rgba(0,0,0,.05);

}

.wrapper::before{

  content:"";

  position:absolute;

  inset:0;

  border-radius:inherit;

  padding:2px;

  background:

  linear-gradient(

    180deg,

    rgba(255,255,255,.95),

    rgba(255,255,255,.3),

    rgba(255,255,255,.05)

  );

  -webkit-mask:
    linear-gradient(#000 0 0)
    content-box,

    linear-gradient(#000 0 0);

  -webkit-mask-composite:xor;

  pointer-events:none;
}

.wrapper:hover{

  transform:
    translateY(-3px)
    scale(1.02);
}

.sm{

  width:180px;
  height:40px;
  font-size:1rem;
}

.md{
  width:280px;
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
}

.highlight{

  position:absolute;

  inset:-50%;

  background:

  radial-gradient(

    circle at var(--mx,50%)
    var(--my,50%),

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

  background:

  radial-gradient(

    ellipse,

    rgba(255,255,255,.9),

    transparent

  );

  filter:blur(15px);

  opacity:.8;
}

.noise{

  position:absolute;

  inset:0;

  opacity:.03;

  background-image:

  radial-gradient(
    #fff 1px,
    transparent 1px
  );

  background-size:
    4px 4px;

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
${text}
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
