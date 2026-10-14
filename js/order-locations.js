(function () {
  var ORDER_LOCATIONS = [
    {
      name: "Plano, TX — MealKeyway",
      addr: "111 W Spring Creek Pkwy #130, Plano, TX 75023",
      url: "https://order.mealkeyway.com/customer/release/index?mid=506733344d65316e615a445156487862392b677549773d3d#/main"
    },
    {
      name: "Carrollton, TX — DoorDash",
      addr: "2528 Old Denton Rd, Ste 310, Carrollton, TX 75006",
      url: "https://www.doordash.com/store/fat-ni-bbq-carrollton-992685/1483008/?rwg_token=AE37R_gX6p2m7AtAAz2u2vpOeki8zWLr1jnVXr-NMmApnRTtBedBBIzau2oXEO89bjtMpwC-9SUH12SLiM7ol7lGIp1AZJn5VQ==&utm_campaign=gpa"
    },
    {
      name: "Carrollton, TX — Fantuan 饭团",
      addr: "2528 Old Denton Rd, Ste 310, Carrollton, TX 75006",
      url: "https://www.fantuanorder.com/store/fat-ni-bbq/us-1440926880?page=restaurant&storeId=1440926880&country=us&wechatId=12&lat=32.98003&lng=-96.908427&shippingType=1&city=Carrollton&rwg_token=AE37R_h0LdTCJmC3_nZ6hCqhiFsevHis2KO3D1quM6_D8TurTfdG4A06omvLjiTc7BMP97cUkYYzYaYxeNUfMrvPe8wX780F3w%3D%3D"
    }
  ];

  var REVIEW_LOCATIONS = [
    {
      name: "Plano, TX",
      addr: "111 W Spring Creek Pkwy #130, Plano, TX 75023",
      url: "https://www.google.com/search?q=Fat+Ni+BBQ+Plano+TX"
    },
    {
      name: "Carrollton, TX",
      addr: "2528 Old Denton Rd, Ste 310, Carrollton, TX 75006",
      url: "https://www.google.com/search?q=Fat+Ni+BBQ+Carrollton+TX"
    }
  ];

  function buildModal(locations, idPrefix, eyebrow, title) {
    var overlay = document.createElement("div");
    overlay.className = "order-modal-overlay";
    overlay.innerHTML =
      '<div class="order-modal" role="dialog" aria-modal="true" aria-labelledby="' + idPrefix + 'Title">' +
        '<button class="order-modal-close" type="button" aria-label="Close">&times;</button>' +
        '<p class="section-eyebrow">' + eyebrow + '</p>' +
        '<h3 id="' + idPrefix + 'Title">' + title + '</h3>' +
        '<div class="order-modal-list">' +
          locations.map(function (l) {
            return '<a class="order-modal-option" href="' + l.url + '" target="_blank" rel="noopener">' +
              '<span class="order-modal-name">' + l.name + '</span>' +
              '<span class="order-modal-addr">' + l.addr + '</span>' +
            '</a>';
          }).join("") +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function close() { overlay.classList.remove("open"); }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    overlay.querySelector(".order-modal-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    return overlay;
  }

  function wire(selector, overlay) {
    var toggles = document.querySelectorAll(selector);
    if (!toggles.length) return;
    toggles.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.add("open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelectorAll("[data-order-toggle]").length) {
      wire("[data-order-toggle]", buildModal(ORDER_LOCATIONS, "orderModal", "Choose A Location", "Where would you like to order from?"));
    }
    if (document.querySelectorAll("[data-review-toggle]").length) {
      wire("[data-review-toggle]", buildModal(REVIEW_LOCATIONS, "reviewModal", "Choose A Location", "Which location would you like to review?"));
    }
  });
})();
