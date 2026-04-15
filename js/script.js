(function (global) {

var dc = {};

// Practical lesson names
var homeHtmlUrl = "home-snippet.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtmlUrl = "categories-title-snippet.html";
var categoryHtmlUrl = "category-snippet.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtmlUrl = "menu-items-title.html";
var menuItemHtmlUrl = "menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  var pattern = new RegExp(propToReplace, "g");
  return string.replace(pattern, propValue);
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function (event) {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );
});

// Builds HTML for the home page based on categories array
function buildAndShowHomeHTML(categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  var randomCategoryShortName = "'" + categories[randomIndex].short_name + "'";

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

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML
  );
};

// Builds HTML for the categories page based on categories array
function buildAndShowCategoriesHTML(categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtmlUrl,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtmlUrl,
        function (categoryHtml) {
          var categoriesViewHtml =
            buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false
      );
    },
    false
  );
}

// Using categories data and snippets html build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// Load the menu items view
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML
  );
};

// Builds HTML for the single category page based on menu items array
function buildAndShowMenuItemsHTML(categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtmlUrl,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtmlUrl,
        function (menuItemHtml) {
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false
      );
    },
    false
  );
}

// Using category and menu items data and snippets html build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;

  for (var i = 0; i < menuItems.length; i++) {
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", menuItems[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertItemPrice(html, "price_small", menuItems[i].price_small);
    html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
    html = insertItemPrice(html, "price_large", menuItems[i].price_large);
    html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);

    if (i % 2 !== 0) {
      html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  switchMenuToActive();
  return finalHtml;
}

function insertItemPrice(html, pricePropName, priceValue) {
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}

function insertItemPortionName(html, portionPropName, portionValue) {
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}

global.$dc = dc;

})(window);
