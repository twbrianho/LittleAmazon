# Little Amazon™ — Fake Shopping, Real Puzzle

## Demo: https://shopping-cart-f16b8.firebaseapp.com

## Functions
* Key functions (add/delete)
    * Login Page
        1. Users can sign up with email account and password. Successful sign-up shows confirmation pop-up.
        2. Users can log in with signed up email account or Google account.
        3. Successful login shows confirmation pop-up, and clicking a button redirects to Home Page.
    * Home Page
        1. Retrieves products and discount sets from Firebase database.
        2. Creates HTML elements and linked functions from the database.
        3. Clicking "Add to Cart" will add products to the shopping cart.
        4. Clicking "remove" in the shopping cart will remove products from the cart.
        5. Clicking "Checkout" in the shopping cart will show confirmation pop-up that displays the total price. 
        If checkout items are a valid "discount set", there will be an altered pop-up that also shows additional info. 
        At this point, the user can still click "Back" to go back, or click "Confirm Purchase", which will (1) clear 
        the shopping cart, (2) push the transaction details to Firebase, and (3) show a "Purchase Successful" pop-up, 
        that allows the user to click one of two buttons — either continue shopping, or view the transaction records.
        6. When checking out, the products in the shopping cart are checked against specific discount sets to see if 
        they qualify for a discount and free movie.
    * Account Page
        1. Users can type in and submit their answers here to check if they got it right.
        2. Submitting an incorrect answer will show a message that tells the user.
        3. Submitting the correct answer will prompt a Chrome notification to appear.
        4. Users can see their past transaction records in a table.
    
* Other functions (add/delete)
    1. If logged in, shows email in navbar. If not, shows "Guest".
    2. Navbar includes a link to Home Page (active), and a dropdown that links to Account Page or logout.
    3. Successful logout shows confirmation pop-up, and clicking a button redirects to Login Page to allow 
    switching accounts smoothly.

## Components Description : 
1. Membership Mechanism : There are sign up, log in, and log in with Google functions in the login page.
2. Host on Firebase : The website is fully functional on https://shopping-cart-f16b8.firebaseapp.com
3. Database Read/Write : All users are able to read from the database, but only logged in users are able to write to it.
4. RWD : small screens will move the shopping cart above the products, instead of the default side-by-side layout.

## Other Functions Description : 
1. Third-Party Sign In : Users are able to sign in with Google accounts.
2. Chrome Notification : Submitting the correct answer will prompt a Chrome notification to appear.
3. Use CSS Animation : Hovering over a product will make it expand its text (full product name), and change the 
background to a light color. Css transition time is 0.5s for the color; honestly, I don't know how to make the text
also slowly expand.

## Security Report
1. The "Checkout" button is not available whenever the shopping cart is empty.
2. Users are able to play the game without logging in, since they can see whether products are parts of a discount set, 
but the system prevents them from confirming a purchase. Only logged in users will have their transactions recorded,  
as is defined in the database rules ("all users are able to read from the database, but only logged in users are able 
to write to it").

# FAQ
**Q: How long should it take to solve the puzzle?**

A: For one person, maybe a couple of hours. For a group of people, it should take ~20 to 30 minutes.

**Q: Will we need to use the source code to solve it?**

A: Nope, the puzzle should be completely solvable just by using the shopping function. Reviewing transaction records in 
the Account Page should help a bit, but nothing is hidden.

**Q: Are there any hints?**

A: Not in the website, but feel free to message me on [facebook](https://www.facebook.com/brianslho) or 
[email me](mailto:brianslho@gmail.com).

**Q: Are there any cheats?**

A: Actually, yes. I think the console will easily cough up all the secrets :P (please don't do that, that's no fun.)