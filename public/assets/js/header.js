(function ($) {
  "use strict";

  var $window = $(window);
  var $mainHeader = $("header.main-header");
  var $premiumHeader = $("header.premium-header");
  var $banner = $(".hero, .page-header").first();
  var $menus = $("header .navbar-nav");
  var premiumVisible;

  // Each header owns its mobile button and dropdown.
  $menus.each(function () {
    var $menu = $(this);
    var $header = $menu.closest("header");
    var mobileMenuId = $menu.attr("id") + "-mobile";

    $menu.slicknav({
      label: "",
      prependTo: $header.find(".responsive-menu"),
      closeOnClick: true,
      beforeOpen: function () {
        $header.find(".slicknav_btn").attr("aria-expanded", "true");
      },
      beforeClose: function () {
        $header.find(".slicknav_btn").attr("aria-expanded", "false");
      },
    });

    $header.find(".slicknav_nav").attr("id", mobileMenuId);
    $header.find(".slicknav_btn").attr({
      "aria-label": "Toggle navigation",
      "aria-controls": mobileMenuId,
      "aria-expanded": "false",
    });
    $header.on("keydown", function (event) {
      if (event.key === "Escape" && $header.find(".slicknav_open").length) {
        $menu.slicknav("close");
        $header.find(".slicknav_btn").trigger("focus");
      }
    });
  });

  function updateHeaderState() {
    var threshold = $banner.length
      ? $banner.offset().top + $banner.outerHeight() * 0.65
      : $mainHeader.outerHeight() || 0;
    var shouldShowPremium = !$mainHeader.length || $window.scrollTop() > threshold;

    if (shouldShowPremium === premiumVisible) return;
    premiumVisible = shouldShowPremium;
    $menus.slicknav("close");
    $mainHeader.find(".header-sticky").toggleClass("hide", shouldShowPremium);
    $premiumHeader.toggleClass("is-visible", shouldShowPremium);
  }

  $window.on("scroll resize load", updateHeaderState);
  updateHeaderState();
})(jQuery);
