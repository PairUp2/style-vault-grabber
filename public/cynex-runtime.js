// Runtime patch injected into the static site iframe.
// Loaded fresh on each navigation so video overrides + form mailing apply
// across every page without rebuilding the static HTML.
(function () {
  if (window.__cynexPatched) return;
  window.__cynexPatched = true;

  function applyVideoOverrides(items) {
    var byId = {};
    var added = [];
    items.forEach(function (it) {
      if (it.is_added) added.push(it);
      else if (it.original_id) byId[it.original_id] = it;
    });

    var iframes = document.querySelectorAll(
      'iframe[src*="youtube.com/embed/"], iframe[src*="youtube.com/watch"], iframe[src*="youtu.be/"], iframe[src*="player.vimeo.com/video/"]',
    );
    iframes.forEach(function (f) {
      var src = f.getAttribute("src") || "";
      var m =
        src.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/) ||
        src.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/) ||
        src.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
      if (!m) return;
      var id = m[1];
      var ov = byId[id];
      if (!ov) return;
      if (ov.is_deleted) {
        var holder = f.closest("figure, .wp-block-embed, p") || f;
        holder.style.display = "none";
        return;
      }
      if (ov.url) {
        try {
          f.src = ov.url;
        } catch (e) {}
      }
    });

    // Also handle YouTube watch links
    var anchors = document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be/"]');
    anchors.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var m =
        href.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/) ||
        href.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
      if (!m) return;
      var ov = byId[m[1]];
      if (ov && ov.url) a.setAttribute("href", ov.url);
      if (ov && ov.is_deleted) a.style.display = "none";
    });

    // Append custom-added videos to footer (or end of body) so admin can add new ones
    if (added.length) {
      var host = document.createElement("section");
      host.style.cssText =
        "max-width:1140px;margin:40px auto;padding:24px;background:#fff;font-family:Poppins,Arial,sans-serif;";
      host.innerHTML =
        '<h3 style="margin:0 0 16px;color:#111;font-size:22px;">More from CYNEX Production</h3>';
      var grid = document.createElement("div");
      grid.style.cssText =
        "display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;";
      added.forEach(function (it) {
        if (!it.url) return;
        var card = document.createElement("div");
        card.style.cssText =
          "border-radius:10px;overflow:hidden;border:1px solid #eee;background:#fff;";
        card.innerHTML =
          '<div style="position:relative;padding-top:56.25%;background:#000;">' +
          '<iframe src="' +
          it.url.replace(/"/g, "") +
          '" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>' +
          "</div>" +
          '<div style="padding:10px 12px;font-size:14px;color:#222;font-weight:600;">' +
          (it.label || "Video") +
          "</div>";
        grid.appendChild(card);
      });
      host.appendChild(grid);
      document.body.appendChild(host);
    }
  }

  function wireForms() {
    var forms = document.querySelectorAll("form");
    forms.forEach(function (form) {
      if (form.__cynexBound) return;
      form.__cynexBound = true;
      // Skip search forms
      if (form.classList.contains("search-form")) return;
      if ((form.getAttribute("role") || "") === "search") return;
      if (
        form.querySelector('input[type="email"], input[name*="email" i], input[name*="mail" i]') ===
          null &&
        form.querySelector('textarea, input[name*="message" i]') === null
      ) {
        return;
      }

      form.addEventListener(
        "submit",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();

          var fd = new FormData(form);
          var entries = {};
          fd.forEach(function (v, k) {
            entries[k] = typeof v === "string" ? v : "";
          });

          function pick(re) {
            for (var k in entries) {
              if (re.test(k)) return entries[k];
            }
            return "";
          }

          var payload = {
            name: pick(/name|fname|fullname|your-name/i) || "Website visitor",
            email: pick(/email|mail/i),
            phone: pick(/phone|mobile|tel/i),
            subject: pick(/subject|title/i) || "Website Enquiry",
            message: pick(/message|comments?|content|details/i) || JSON.stringify(entries),
            source:
              location.pathname.indexOf("enquiry") > -1
                ? "enquiry"
                : location.pathname.indexOf("contact") > -1
                  ? "contact"
                  : "website",
          };

          if (!payload.email) {
            alert("Please enter your email.");
            return;
          }

          // Submit button feedback
          var submit = form.querySelector('button[type="submit"], input[type="submit"]');
          var originalText = submit ? submit.textContent || submit.value : "";
          if (submit) {
            if ("disabled" in submit) submit.disabled = true;
            if (submit.tagName === "BUTTON") submit.textContent = "Sending…";
            else submit.value = "Sending…";
          }

          fetch("/api/public/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then(function (r) {
              return r.json().then(function (d) {
                return { ok: r.ok, d: d };
              });
            })
            .then(function (res) {
              if (res.ok) {
                form.reset();
                showToast("Thanks! Your message has been sent. We will get back to you shortly.");
              } else {
                showToast(
                  "Sorry, we couldn't send your message. Please try again or email us directly.",
                  true,
                );
              }
            })
            .catch(function () {
              showToast("Network error. Please check your connection and try again.", true);
            })
            .finally(function () {
              if (submit) {
                if ("disabled" in submit) submit.disabled = false;
                if (submit.tagName === "BUTTON") submit.textContent = originalText;
                else submit.value = originalText;
              }
            });
        },
        true,
      );
    });
  }

  function showToast(msg, isError) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText =
      "position:fixed;left:50%;bottom:30px;transform:translateX(-50%);" +
      "background:" +
      (isError ? "#dc2626" : "#16a34a") +
      ";color:#fff;padding:14px 20px;border-radius:10px;z-index:99999;" +
      "font-family:Poppins,Arial,sans-serif;font-size:14px;box-shadow:0 8px 30px rgba(0,0,0,.25);" +
      "max-width:90vw;text-align:center;";
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .4s";
      t.style.opacity = "0";
      setTimeout(function () {
        t.remove();
      }, 500);
    }, 4500);
  }

  function addAdminButton() {
    var footer = document.querySelector("footer, .elementor-location-footer, #colophon");
    var container = footer || document.body;

    var btn = document.createElement("a");
    btn.href = "/site/admin/index.html";
    btn.textContent = "Admin Access";
    btn.style.cssText =
      "display:inline-block;margin:10px;font-size:12px;color:#999;text-decoration:none;opacity:0.5;transition:opacity 0.3s;";
    btn.onmouseover = function () {
      this.style.opacity = "1";
    };
    btn.onmouseout = function () {
      this.style.opacity = "0.5";
    };

    if (footer) {
      footer.appendChild(btn);
    } else {
      btn.style.position = "fixed";
      btn.style.bottom = "10px";
      btn.style.right = "10px";
      btn.style.zIndex = "9999";
      document.body.appendChild(btn);
    }
  }

  function init() {
    wireForms();
    addAdminButton();
    try {
      var stored = localStorage.getItem("cynex_admin_videos");
      if (stored) {
        applyVideoOverrides(JSON.parse(stored));
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
