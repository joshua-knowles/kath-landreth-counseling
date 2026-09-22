// Kath Landreth Counselling & Supervision — shared site behaviour.
// No analytics, no third-party scripts, no data persistence of any kind.

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initContactForm();
  initFooterYear();
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
