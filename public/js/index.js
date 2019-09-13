// Global variables
let product_list = []; // Array of Products
let shopping_cart = []; // Array of Products
let discount_list = []; // Array of DiscountSets
let matched_discount_set = null; // Stores the DiscountSet that matches shopping cart, or null for none matched
let total_price = 0; // The original total price, before discount

let user_transaction_ref = null;
// transactions: {
//     transaction_id: {
//         products: [Products],
//         total_price: integer (before discount),
//         percent_off: integer,
//         free_movie: string
//     }
// }

// Object constructor for Products
function Product(name, price, img_filename, category, id) {
    this.name = name;
    this.price = price;
    this.img = img_filename;
    this.category = category;
    this.id = id;
}

// Object constructor for Product Discount Sets
function DiscountSet(pi1, pi2, pi3, percent_off, free_movie) {
    this.set = new Set([product_list[pi1], product_list[pi2], product_list[pi3]]);
    this.percent_off = percent_off;
    this.free_movie = free_movie;
}

// Remove a product from the shopping cart
function removeFromCart(element) {
    // Get row to find which index in shopping cart to remove
    const row = element.parentNode.parentNode.rowIndex - 1;
    shopping_cart.splice(row, 1);
    console.log(shopping_cart);
    updateShoppingCart();
}

// Popup for checkout (without discount)
function showNormalPopup(price) {
    $("#modal-price").html(price.toFixed(2));
    $("#normal-modal").modal("show");
}

// Popup for checkout (without discount)
function showDiscountedPopup(original_price, percent_off, free_movie) {
    $("#modal-original-price").html(original_price.toFixed(2));
    $("#modal-discount-percent").html(percent_off);
    $("#modal-discounted-price").html((original_price * (100 - percent_off) / 100).toFixed(2));
    $("#modal-free-movie").html(free_movie);
    $("#discount-modal").modal("show");
}

// Compare if 2 sets have the same members (WHY ISN'T THIS BUILT-IN???)
function setCompare(set1, set2) {
    if (set1.size !== set2.size) {
        return false;
    }
    for (const a of set1) {
        if (!set2.has(a)) {
            return false;
        }
    }
    return true;
}

// Check if products in shopping cart are a Discount Set
function matchDiscountSet() {
    // Convert shopping list into a set of its names
    let checkout_set = new Set(shopping_cart);
    console.log(checkout_set);
    // Compare shopping cart set matches any discount set from discount list
    for (const discount_set of discount_list) {
        if (setCompare(discount_set.set, checkout_set)) {
            // Return the matched discount set
            return discount_set;
        }
    }
    // No discount set matched
    return null;
}

// Add product HTML code to the page, and create purchase button functions
function populateProductHtml(product) {
    // Dynamically create HTML code for the product
    let img_url = "url(products/" + product.img + ")";
    let html_code = "<div class='item-block'>" +
        "<div class='item-img' style='width: 100px; height: 100px; background: " + img_url + " no-repeat center; background-size: contain;'></div>" +
        "<div class='item-name'>" + product.name + "</div>" +
        "<div class='item-price'>" + product.price.toFixed(2) + "$</div>" +
        "<button id='product-" + product.id + "-btn' type='button' class='btn themed-btn'>Add to Cart</button>" +
        "</div>";
    $("#row-" + product.category).append(html_code);
    // Dynamically create buttons for each product
    $("#product-" + product.id + "-btn").click(function () {
        shopping_cart.push(product_list[product.id]);
        updateShoppingCart();
    });
    console.log("DONE: " + product.name);
}

// Add product HTML code to the shopping cart, and update total price
function updateShoppingCart() {
    let full_code = "";
    total_price = 0;
    for (let product of shopping_cart) {
        let img_url = "url(products/" + product.img + ")";
        let html_code = "<tr>" +
            "<td><div class='cart-item-img' style='width: 50px; height:50px; " +
            "background: " + img_url + " no-repeat center; background-size: contain;'></td>" +
            "<td>" + product.name + "</td>" +
            "<td>" + product.price.toFixed(2) + "$</td>" +
            "<td><span class='fake-link' onclick='removeFromCart(this)'>remove</span></td>" +
            "</tr>";
        full_code += html_code;
        total_price += product.price;
    }
    $("#shopping-cart-contents").html(full_code);
    $("#total-price").html(total_price.toFixed(2));
    // Only show checkout button if cart isn't empty
    if (total_price === 0) {
        $("#checkout-btn").css("display", "none");
    } else {
        $("#checkout-btn").css("display", "block");
    }
}

// Retrieve product list from Firebase, and create HTML elements
function retrieveProducts() {
    firebase.database().ref("products").once("value", function (snapshot) {
        snapshot.forEach(function (product) {
            let product_data = product.val();
            const name = product_data.name;
            const price = product_data.price;
            const img = product_data.img;
            const category = product_data.category;
            const id = parseInt(product.key);
            let new_product = new Product(name, price, img, category, id);
            product_list.push(new_product);
            populateProductHtml(new_product);
        });
        console.log("Retrieved all products from database.");
    }).catch(e => console.log(e.message));
}

// Retrieve discount set list from Firebase
function retrieveDiscountSets() {
    firebase.database().ref("discount_sets").once("value", function (snapshot) {
        snapshot.forEach(function (discount_set) {
            let discount_set_data = discount_set.val();
            const product_index_1 = discount_set_data.product_index_1;
            const product_index_2 = discount_set_data.product_index_2;
            const product_index_3 = discount_set_data.product_index_3;
            const percent_off = discount_set_data.percent_off;
            const free_movie = discount_set_data.free_movie;
            discount_list.push(new DiscountSet(product_index_1, product_index_2, product_index_3, percent_off, free_movie));
        });
        console.log("Retrieved all discount sets from database.");
    }).catch(e => console.log(e.message));
}

// Records transaction in Firebase
function pushTransaction() {
    // Shows failure pop-up if not logged in
    if (user_transaction_ref === null) {
        $("#purchase-failure-modal").modal("show");
        return false;
    }
    // Push transaction data to Firebase
    if (shopping_cart) {
        let new_transaction_ref = user_transaction_ref.push();
        if (matched_discount_set !== null) {
            new_transaction_ref.set({
                "products": shopping_cart,
                "total_price": total_price,
                "percent_off": matched_discount_set.percent_off,
                "free_movie": matched_discount_set.free_movie
            });
        } else {
            new_transaction_ref.set({
                products: shopping_cart,
                total_price: total_price,
                percent_off: 0,
                free_movie: "none"
            });
        }
        return true;
    }
}

function initPage() {
    retrieveProducts();
    retrieveDiscountSets();
    updateShoppingCart();
}

// Main code
window.onload = function () {
    initPage();

    firebase.auth().onAuthStateChanged(function (user) {
        // Check if logged in
        if (user) {
            user_transaction_ref = firebase.database().ref("users/" + user.uid + "/transactions");
            $("#navbarDropdownMenuLink").html(user.email);
            $("#dynamic-dropdown-menu").html("<a class='dropdown-item' href='account.html'>Transaction Records</a>" +
                "<a class='dropdown-item' id='logout-btn'>Log out</span>");
            $("#logout-btn").click(function () {
                firebase.auth().signOut().then(function () {
                    $("#logout-successful-modal").modal("show");
                });
            });
        } else {
            user_transaction_ref = null;
            $("#navbarDropdownMenuLink").html("Guest");
            $("#dynamic-dropdown-menu").html("<a class='dropdown-item' href='login.html'>Log in</a>");
            $("#post_list").html("");
        }
    });

    // Clicking the checkout button -> check if discount set
    $("#checkout-btn").click(function () {
        console.log("Checkout");
        if (shopping_cart.length !== 3) {
            // Added a new rule, where dupes won't allow discounts
            showNormalPopup(total_price);
            return;
        }
        matched_discount_set = matchDiscountSet();
        console.log("Matched discount set: " + matched_discount_set);
        if (matched_discount_set === null) {
            showNormalPopup(total_price);
        } else {
            showDiscountedPopup(total_price, matched_discount_set.percent_off, matched_discount_set.free_movie);
        }
    });

    // Clicking "Confirm Purchase" -> clear cart and record completed transaction
    $("#confirm-purchase-btn, #discount-confirm-purchase-btn").click(function () {
        if (pushTransaction()) {
            $("#purchase-successful-modal").modal("show");
            shopping_cart = [];
            updateShoppingCart();
        }
    });
};