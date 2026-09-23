// Kath Landreth Counselling & Supervision — shared site behaviour.
// No analytics, no third-party scripts, no data persistence of any kind.

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initContactForm();
  initFooterYear();
  initServicesCarousel();
  initHoverOutlineTiming();
});

function initFooterYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Progressive-enhancement submit handler for the enquiry form.
//
// The form's `action` attribute already points at a form-to-email
// endpoint (placeholder: Formspree — see contact.html for the TODO on
// confirming this against Kath's real hosting choice). This script only
// intercepts submission to show an inline status message instead of a
// full page reload; it does not read, store, or forward the field
// values anywhere itself. If JS fails to load, the form still submits
// normally via its action/method attributes.
function initContactForm() {
  var form = document.getElementById("enquiry-form");
  var status = document.getElementById("form-status");

  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    // Honeypot check: if the hidden field has been filled in, silently
    // block submission (likely a bot). Nothing is logged or stored.
    var honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      event.preventDefault();
      return;
    }

    // If the endpoint hasn't been configured yet, don't let the form
    // silently fail against a placeholder URL — tell the developer/tester.
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      event.preventDefault();
      showStatus(
        status,
        "This form isn't connected to an email service yet. See the TODO in contact.html / README.md.",
        "error"
      );
      return;
    }

    event.preventDefault();
    submitViaFetch(form, status);
  });
}

function submitViaFetch(form, status) {
  var data = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
    .then(function (response) {
      if (response.ok) {
        form.reset();
        showStatus(
          status,
          "Thank you — your message has been sent. Kath (or her team) will be in touch soon.",
          "success"
        );
      } else {
        showStatus(
          status,
          "Something went wrong sending your message. Please try again, or email directly using the details on this page.",
          "error"
        );
      }
    })
    .catch(function () {
      showStatus(
        status,
        "Something went wrong sending your message. Please try again, or email directly using the details on this page.",
        "error"
      );
    });
}

function showStatus(el, message, kind) {
  el.textContent = message;
  el.classList.remove("is-success", "is-error");
  el.classList.add("is-visible", kind === "success" ? "is-success" : "is-error");
  el.setAttribute("role", "status");
}

// Services carousel (about.html). Circular: slide position is always the
// shortest signed distance from the current slide, so "next" from the
// last slide wraps to the first and vice versa, forever. Without this
// script the markup falls back to the plain .card-grid layout (see
// css/style.css), so nothing here is required for the content to be
// readable.
function initServicesCarousel() {
  var root = document.getElementById("services-carousel");
  var dotsContainer = document.getElementById("services-dots");
  if (!root || !dotsContainer) return;

  var track = root.querySelector(".carousel-track");
  var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
  var prevBtn = root.querySelector(".carousel-arrow-prev");
  var nextBtn = root.querySelector(".carousel-arrow-next");
  if (!track || slides.length < 2 || !prevBtn || !nextBtn) return;

  var SLIDE_GAP = 32; // px between slide centres, on top of slide width
  var current = 0;
  var step = 0;
  var dots = [];

  slides.forEach(function (slide, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", "Go to service " + (i + 1) + " of " + slides.length);
    dot.addEventListener("click", function () {
      goTo(i);
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function measure() {
    // Size the track from the tallest/widest slide, not just the active
    // one, so the carousel (and the arrow buttons pinned to its middle)
    // stay a fixed size no matter which slide is showing.
    var maxWidth = 0;
    var maxHeight = 0;
    slides.forEach(function (slide) {
      if (slide.offsetWidth > maxWidth) maxWidth = slide.offsetWidth;
      if (slide.offsetHeight > maxHeight) maxHeight = slide.offsetHeight;
    });
    step = maxWidth + SLIDE_GAP;
    track.style.height = maxHeight + "px";
  }

  function render() {
    var total = slides.length;

    slides.forEach(function (slide, i) {
      var distance = ((i - current) % total + total) % total;
      if (distance > total / 2) distance -= total;
      var magnitude = Math.abs(distance);
      var isActive = distance === 0;

      slide.style.setProperty("--slide-offset", distance * step + "px");
      slide.style.setProperty("--slide-scale", isActive ? "1" : "0.88");
      slide.style.setProperty("--slide-opacity", isActive ? "1" : magnitude === 1 ? "0.35" : "0");
      slide.style.setProperty("--slide-blur", isActive ? "0px" : "4px");
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    dots.forEach(function (dot, i) {
      var isActive = i === current;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function goTo(index) {
    var total = slides.length;
    current = ((index % total) + total) % total;
    measure();
    render();
  }

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
  });

  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
  });

  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    }
  });

  window.addEventListener("resize", function () {
    measure();
    render();
  });

  root.classList.add("is-carousel");
  prevBtn.hidden = false;
  nextBtn.hidden = false;
  dotsContainer.hidden = false;

  measure();
  render();
}

// Sizes the hover-outline sweep (see css/style.css's "Animated hover
// outline" block) so it travels at a constant visual speed instead of a
// fixed duration. A fixed duration looks right on a small card but
// rushed on a much wider container like the note box, since the ring
// has a longer perimeter to cover in the same time. Setting
// --outline-duration per element, proportional to its own perimeter,
// keeps the sweep reading at the same pace everywhere.
function initHoverOutlineTiming() {
  var elements = document.querySelectorAll(".card, .note-box, .hero-image-slot, .portrait-slot");
  if (!elements.length) return;

  // Calibrated so a typical small card (~350x210px, perimeter ~1120px)
  // lands close to the 0.5s duration that already looked right there.
  // MAX_DURATION caps how far wide containers (e.g. the note box) can
  // stretch — a straight perimeter/speed calculation reached ~1.15s
  // there, which read as too slow; capping it splits the difference
  // between that and the original flat 0.5s. Small containers are well
  // under this cap already, so they're unaffected.
  var PX_PER_SECOND = 2200;
  var MIN_DURATION = 0.35;
  var MAX_DURATION = 0.8;

  function apply() {
    elements.forEach(function (el) {
      var perimeter = 2 * (el.offsetWidth + el.offsetHeight);
      var duration = perimeter / PX_PER_SECOND;
      duration = Math.max(MIN_DURATION, Math.min(MAX_DURATION, duration));
      el.style.setProperty("--outline-duration", duration.toFixed(2) + "s");
    });
  }

  apply();

  var resizeTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(apply, 150);
  });
}
