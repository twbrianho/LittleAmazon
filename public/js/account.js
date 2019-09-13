// Global variables
let user_puzzle_ref = null; // Firebase reference for the user's puzzle stats
// uid:{
//     puzzle: {
//         solved: boolean,
//         guesses: {
//             guess_id: {
//                 guess: string
//             }
//         }
//     },
//     transactions: [transactions]
// }
let user_transaction_ref = null; // Firebase reference for the user's transactions
// transactions: {
//     transaction_id: {
//         products: [Products],
//         total_price: integer (before discount),
//         percent_off: integer or null,
//         free_movie: string
//     }
// }

function puzzleSolvedNotif(){
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification("Congratulations!", {
            icon: "https://shopping-cart-f16b8.firebaseapp.com/assets/logo.png",
            body: "You solved the puzzle! Here's a cute pic for you!",
        });

        notification.onclick = function () {
            window.open("https://shopping-cart-f16b8.firebaseapp.com/assets/yuki.jpg");
        };
    }
}

// Add transaction HTML code
function updateTransactionTable(snapshot) {

    let full_html = "";

    snapshot.forEach(function (transaction) {
        let transaction_data = transaction.val();
        const products = transaction_data.products;
        const total_price = transaction_data.total_price;
        const percent_off = transaction_data.percent_off;
        const free_movie = transaction_data.free_movie;

        let products_html = "";
        for (let product of products) {
            let img_url = "url(products/" + product.img + ")";
            let product_img_html = "<div class='cart-item-img' style='width: 50px; height:50px; " +
                "background: " + img_url + " no-repeat center; background-size: contain;'></div>";
            products_html += product_img_html;
        }

        let transaction_html = "<tr><td class='product-imgs'>" + products_html + "</td>" +
            "<td>" + total_price + "&dollar;</td>" +
            "<td>" + percent_off + "&percnt;</td>" +
            "<td>" + (total_price * (100 - percent_off) / 100).toFixed(2) + "&dollar;</td>" +
            "<td>" + free_movie + "</td>" +
            "</tr>";

        full_html += transaction_html;
    });

    $("#transaction-tbody").html(full_html);
}

// Main code
window.onload = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        // Check if logged in
        if (user) {
            user_puzzle_ref = firebase.database().ref("users/" + user.uid+"/puzzle");
            user_transaction_ref = firebase.database().ref("users/" + user.uid + "/transactions");
            $("#navbarDropdownMenuLink").html(user.email);
            $("#dynamic-dropdown-menu").html("<a class='dropdown-item' href='account.html'>Transaction Records</a>" +
                "<a class='dropdown-item' id='logout-btn'>Log out</span>");
            $("#logout-btn").click(function () {
                firebase.auth().signOut().then(function () {
                    $("#logout-successful-modal").modal("show");
                });
            });
            // Retrieve transaction records
            user_transaction_ref.on("value", function (snapshot) {
                updateTransactionTable(snapshot);
            });
        } else {
            $("#navbarDropdownMenuLink").html("Guest");
            $("#dynamic-dropdown-menu").html("<a class='dropdown-item' href='login.html'>Log in</a>");
            $("#post_list").html("");
            $("#transaction-records").html("<h2 style='text-align: center;'>—Please log in to view transaction records—</h2>")
        }

        // Answer submitted
        $("#submit-btn").click(function (){
            // Remove whitespace and capitalize input
            const answer_input = $("#answer-form").val().toUpperCase().replace(/\s+/g, "");
            // Push guess record to Firebase
            user_puzzle_ref.child("guesses").push().set({"guess": answer_input});
            // Check answer
            if (answer_input==="ENDGAME") {
                $("#answer-response").html("<b>Congratulations!</b> You solved the puzzle!<br>" +
                    "(Also, sorry about the Chrome notification, it's a requirement for my midterm project.)");
                puzzleSolvedNotif();
                user_puzzle_ref.child("solved").set(true);
            } else {
                $("#answer-response").html("<b>"+answer_input+"</b> is not correct. Try again.");
            }
        });

        // Submits answer when ENTER key is pressed
        $(document).keypress(function(e){
            if (e.which === 13){
                $("#submit-btn").click();
            }
        });
    });
};