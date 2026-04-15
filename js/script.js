// STEP 0
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  buildAndShowHomeHTML,
  true
);

// STEP 1-4
function buildAndShowHomeHTML(categories) {

  var randomIndex = Math.floor(Math.random() * categories.length);
  var randomCategoryShortName =
    "'" + categories[randomIndex].short_name + "'";

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var homeHtmlToInsertIntoPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          randomCategoryShortName
        );

      insertHtml("#main-content", homeHtmlToInsertIntoPage);
    },
    false
  );
}
