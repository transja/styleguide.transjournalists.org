function closeTableOfContents() {
  $(".table-of-contents").removeClass("open");
  console.log("close");
  // $(".table-of-contents li a").off("click", closeTableOfContents);
}

// Rename the first TOC entry
$(".table-of-contents > ul:first-child > li:first-child a").text(
  "Introduction"
);

function hideExtraItems() {
  // Hide all 3rd-level headings
  $(".table-of-contents ul li ul li ul").css("display", "none");

  // Hide empty list items (i.e., without <a> tags but contain <ul> tags)
  $(".table-of-contents > ul > li > ul > li").each((idx, el) => {
    if (!$(el).children("a").length) {
      $(el).css("display", "none");
    }
  });
}

hideExtraItems();

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entries.length)
        $(`.table-of-contents li`).css("font-weight", "normal");
      $(`.table-of-contents [href="#${entry.target.id}"]`)
        .parent()
        .css("font-weight", "bold");
      // console.log(
      //   $(`.table-of-contents [href="#${entry.target.id}"] ul`).children()
      // );
      // $(`.table-of-contents [href="#${entry.target.id}"] ul`)
      //   .children()
      //   .css("display", null);
    }
  });
});

document.querySelectorAll(".gh-content h1").forEach((el) => io.observe(el));

$(".table-of-contents a").on("click", closeTableOfContents);

const search = $(
  '<input type="text" id="search" placeholder="Search..." />'
).on("keyup", (evt) => {
  const getId = (el) => $(el).attr("id") || getId($(el).parent());

  if (evt.target.value !== "") {
    const matches = [
      ...$(":not(.table-of-contents) p,li,h1,h2,h3,h4,h5")
        .filter((i, el) =>
          $(el).text().toLowerCase().includes(evt.target.value.toLowerCase())
        )
        .map(
          (i, el) =>
            $(el).attr("id") ||
            $(el).prevAll("[id]").attr("id") ||
            $(el).parent().attr("id") ||
            $(el).parent().prevAll("[id]").attr("id")
        ),
    ].map((d) => "#" + d);

    $(".table-of-contents ul.results").empty();
    $(".table-of-contents .search").css("display", "block");
    $(".table-of-contents ul:not(.results)")
      .css("display", "none")
      .children("li")
      .each((i, el) => {
        if (matches.includes($(el).children("a").attr("href"))) {
          $(el).clone().appendTo(".table-of-contents .results");
        }
      });
  } else {
    $(".table-of-contents .search").css("display", "none");
    $(".table-of-contents ul:not(.results)").css("display", "block");
    hideExtraItems();
  }
  $(".table-of-contents a").on("click", closeTableOfContents);
});

const searchResults = $(
  '<div class="search"><h5>Search results</h5><ul class="results"></ul></div>'
).css("display", "none");
// Add search to TOC
$(".table-of-contents").prepend(searchResults);
$(".table-of-contents").prepend(search);

// Add TOC header
$(".table-of-contents").prepend($("<h5>Table of Contents</h5>"));

// Add updated lines
const pubDate = new Date($("time.published").text());
$("h3[updated]").each((i, v) => {
  const ds = new Date(v.getAttribute("updated"));
  if (ds !== pubDate) {
    $(v).append(
      `<div class="last-updated">Last updated ${ds.toLocaleString("en-US", {
        dateStyle: "medium",
      })}</div>`
    );
  }
});

// Add copy on click behavior
$(".header-anchor").on("click", ({ target }) => {
  const url = new URL(window.location);
  url.hash = $(target).attr("href");
  navigator.clipboard.writeText(url.toString());
});

// Toggle the menu open and close when on mobile
const burgerButton = document.querySelector(".gh-burger");
burgerButton.addEventListener("click", function () {
  document.body.classList.toggle("gh-head-open");
});

// Rewrite search button functionality
$(".table-of-contents").prepend(
  $("<a href='' class='close'>[close]</a>").on("click", closeTableOfContents)
);

$(".gh-search").on("click", () => {
  $(".table-of-contents").addClass("open");
  $("body").on("keydown", (e) => {
    if (e.key === "Escape") {
      closeTableOfContents();
    }
  });
});
