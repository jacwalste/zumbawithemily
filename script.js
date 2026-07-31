/* ============================================================
   Zumba with Emily — site behavior
   ============================================================ */

/* ---- CONFIG — fill these in before launch ------------------
   WEB3FORMS_KEY: free key from https://web3forms.com — enter
     Emily's email there and the key arrives instantly. Signups
     land in her inbox; no server needed.
   VENMO_URL / FACEBOOK_URL: leave "" to hide those links.     */
const CONFIG = {
  WEB3FORMS_KEY: "",
  VENMO_URL: "https://venmo.com/u/emilystepanek",
  FACEBOOK_URL: "https://www.facebook.com/emily.e.stepanek",
};

const FALLBACK_MSG =
  "Hmm, that didn't go through. Text Emily instead: 573-529-1127";

/* ---- upcoming Saturdays ------------------------------------ */

function upcomingSaturdays(count) {
  // Class is Saturday 9:30 AM Central. Show today only before class time.
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysUntilSat = (6 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + daysUntilSat);
  if (daysUntilSat === 0 && (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() >= 30))) {
    d.setDate(d.getDate() + 7);
  }
  const dates = [];
  for (let i = 0; i < count; i++) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return dates;
}

function renderDatePills() {
  const container = document.getElementById("date-pills");
  const fmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
  upcomingSaturdays(4).forEach((date, i) => {
    const id = `sat-${i}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "class_date";
    input.id = id;
    input.value = fmt.format(date);
    input.required = true;
    if (i === 0) input.checked = true;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = fmt.format(date);

    container.append(input, label);
  });
}

/* ---- form submission --------------------------------------- */

async function submitToWeb3Forms(payload) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Web3Forms returned ${res.status}`);
  }
}

function wireForm(formId, statusId, buildPayload, successMsg) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form__status";
    status.textContent = "";

    if (!form.reportValidity()) return;

    if (!CONFIG.WEB3FORMS_KEY) {
      console.error(
        "WEB3FORMS_KEY is not set in script.js — form submissions cannot be delivered."
      );
      status.classList.add("form__status--err");
      status.textContent = FALLBACK_MSG;
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    status.textContent = "Sending…";

    try {
      await submitToWeb3Forms({
        access_key: CONFIG.WEB3FORMS_KEY,
        ...buildPayload(new FormData(form)),
      });
      form.reset();
      if (formId === "rsvp-form") {
        const first = form.querySelector("input[type=radio]");
        if (first) first.checked = true;
      }
      status.classList.add("form__status--ok");
      status.textContent = successMsg;
    } catch (err) {
      console.error("Form submission failed:", err);
      status.classList.add("form__status--err");
      status.textContent = FALLBACK_MSG;
    } finally {
      button.disabled = false;
    }
  });
}

/* ---- init --------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderDatePills();

  wireForm(
    "rsvp-form",
    "rsvp-status",
    (fd) => ({
      subject: `Zumba RSVP: ${fd.get("name")} for ${fd.get("class_date")}`,
      from_name: "zumbawithemily.com",
      "Class date": fd.get("class_date"),
      "Name": fd.get("name"),
      "Phone or email": fd.get("contact"),
      "Party size": fd.get("party_size"),
      "Note": fd.get("note") || "(none)",
    }),
    "You're in! Emily just got your RSVP. See you Saturday! 💃"
  );

  wireForm(
    "contact-form",
    "contact-status",
    (fd) => ({
      subject: `Zumba site question: ${fd.get("name")}`,
      from_name: "zumbawithemily.com",
      "Name": fd.get("name"),
      "Phone or email": fd.get("contact"),
      "Message": fd.get("message"),
    }),
    "Sent! Emily will get back to you soon."
  );

  // Optional links — hidden until CONFIG has real URLs
  const venmo = document.getElementById("venmo-link");
  if (CONFIG.VENMO_URL) {
    venmo.href = CONFIG.VENMO_URL;
    venmo.hidden = false;
  }

  const fb = document.getElementById("facebook-link");
  const fbFallback = document.getElementById("facebook-fallback");
  if (CONFIG.FACEBOOK_URL) {
    fb.href = CONFIG.FACEBOOK_URL;
    fb.hidden = false;
    fbFallback.hidden = true;
  }
});
