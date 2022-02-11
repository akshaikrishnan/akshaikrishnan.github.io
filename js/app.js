// ----- STICKY ----- //
$(window).scroll(function () {
  var scroll = $(window).scrollTop();

  if (scroll >= 40) {
    $(".navbar-sticky").addClass("darkheader");
  } else {
    $(".navbar-sticky").removeClass("darkheader");
  }
});

// ----- SCROLLMENU ----- //
$(".navigation-menu a").on("click", function (event) {
  var $anchor = $(this);
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: $($anchor.attr("href")).offset().top - 0,
      },
      1500,
      "easeInOutExpo"
    );
  event.preventDefault();
});

// ----- MAIN-MENU ----- //

var scroll = $(window).scrollTop();

$(".navbar-toggle").on("click", function (event) {
  $(this).toggleClass("open");
  $("#navigation").slideToggle(400);
});

$(".navigation-menu>li").slice(-2).addClass("last-elements");

$(".menu-arrow,.submenu-arrow").on("click", function (e) {
  if ($(window).width() < 992) {
    e.preventDefault();
    $(this)
      .parent("li")
      .toggleClass("open")
      .find(".submenu:first")
      .toggleClass("open");
  }
});

// ----- SCROLLSPY ----- //
$("#navigation").scrollspy({
  offset: 50,
});

// ----- TYPED ----- //
$(".element").each(function () {
  var $this = $(this);
  $this.typed({
    strings: $this.attr("data-elements").split(","),
    typeSpeed: 100, // typing speed
    backDelay: 3000, // pause before backspacing
  });
});

// Portfolio filter
$(window).on("load", function () {
  var $container = $(".portfolioContainer");
  var $filter = $("#filter");
  $container.isotope({
    filter: "*",
    layoutMode: "masonry",
    animationOptions: {
      duration: 750,
      easing: "linear",
    },
  });
  $filter.find("a").click(function () {
    var selector = $(this).attr("data-filter");
    $filter.find("a").removeClass("active");
    $(this).addClass("active");
    $container.isotope({
      filter: selector,
      animationOptions: {
        animationDuration: 750,
        easing: "linear",
        queue: false,
      },
    });
    return false;
  });
});

// Magnific Popup
$(".mfp-image").magnificPopup({
  type: "image",
  closeOnContentClick: true,
  mainClass: "mfp-fade",
  gallery: {
    enabled: true,
    navigateByImgClick: true,
    preload: [0, 1],
  },
});

$(function () {
  $("#cv").on("click", function (e) {
    e.preventDefault();
    var url =
      "https://www.dropbox.com/s/qpp9d6z29p8qqu7/Akshai%20Krishnan%20UI%20Resume.pdf?dl=1";
    window.open(url, "_self");
  });
});

$(function () {
  $("a.btn").on("click", function (e) {
    e.preventDefault();
    var url = $(this).attr("data-elements");
    console.log(url);
    window.open(url, "_blank");
  });
});

function getAge(dateString) {
  var now = new Date();
  var today = new Date(now.getYear(), now.getMonth(), now.getDate());

  var yearNow = now.getYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();

  var dob = new Date(
    dateString.substring(6, 10),
    dateString.substring(0, 2) - 1,
    dateString.substring(3, 5)
  );

  var yearDob = dob.getYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();
  var age = {};
  var ageString = "";
  var yearString = "";
  var monthString = "";
  var dayString = "";

  var yearAge = yearNow - yearDob;

  if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
  else {
    yearAge--;
    var monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
  else {
    monthAge--;
    var dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge,
  };

  if (age.years > 1) yearString = " years";
  else yearString = " year";
  if (age.months > 1) monthString = " months";
  else monthString = " month";
  if (age.days > 1) dayString = " days";
  else dayString = " day";

  if (age.years > 0 && age.months > 0 && age.days > 0)
    ageString =
      age.years +
      yearString +
      ", " +
      age.months +
      monthString +
      ", and " +
      age.days +
      dayString;
  else if (age.years == 0 && age.months == 0 && age.days > 0)
    ageString = "Only " + age.days + dayString + " old!";
  else if (age.years > 0 && age.months == 0 && age.days == 0)
    ageString = age.years + yearString + " old. Happy Birthday!!";
  else if (age.years > 0 && age.months > 0 && age.days == 0)
    ageString =
      age.years + yearString + " and " + age.months + monthString + " old.";
  else if (age.years == 0 && age.months > 0 && age.days > 0)
    ageString =
      age.months + monthString + " and " + age.days + dayString + " old.";
  else if (age.years > 0 && age.months == 0 && age.days > 0)
    ageString =
      age.years + yearString + " and " + age.days + dayString + " old.";
  else if (age.years == 0 && age.months > 0 && age.days == 0)
    ageString = age.months + monthString + " old.";
  else ageString = "Oops! Could not calculate age!";

  return ageString;
}
$(window).on("load", function () {
  $("#years").html(getAge("07/06/2017"));
});
