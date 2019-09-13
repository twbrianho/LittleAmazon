function showPopup(type, msg) {
    if (type === "error") {
        $("#errorModalBody").html(msg);
        $("#errorModal").modal("show");
    } else if (type === "success") {
        $("#successModalBody").html(msg);
        $("#successModal").modal("show");
    }
}

window.onload = function () {
    let email_input = document.getElementById('email-input');
    let pwd_input = document.getElementById('pwd-input');

    $("#login-btn").click(function () {
        firebase.auth().signInWithEmailAndPassword(email_input.value, pwd_input.value).then(function(result){
            showPopup("success", "You are now logged in.");
        }).catch(function (error) {
            showPopup("error", error.message);
            email_input.value = "";
            pwd_input.value = "";
        });
    });

    $("#google-btn").click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result){
            showPopup("success", "Google account sign-in successful.");
        }).catch(function (error) {
            showPopup("error", error.message);
        });
    });

    $("#signup-btn").click(function () {
        firebase.auth().createUserWithEmailAndPassword(email_input.value, pwd_input.value).then(function(result){
            showPopup("success", "Sign-up successful.");
        }).catch(function (error) {
            showPopup("error", error.message);
            email_input.value = "";
            pwd_input.value = "";
        });
    });

    // const emailInput = document.getElementById('email-input');
    // const pwd_input = document.getElementById('pwd-input');
    // const loginBtn = document.getElementById('login-btn');
    // const googleBtn = document.getElementById('google-btn');
    // const signupBtn = document.getElementById('signup-btn');
    //
    // loginBtn.addEventListener('click', function () {
    //     firebase.auth().signInWithEmailAndPassword(emailInput.value, pwd_input.value).then(function(result){
    //         showPopup("success", "You are now logged in.");
    //     }).catch(function (error) {
    //         showPopup("error", error.message);
    //         emailInput.value = "";
    //         pwd_input.value = "";
    //     });
    // });
    //
    // googleBtn.addEventListener('click', function () {
    //     var provider = new firebase.auth.GoogleAuthProvider();
    //     firebase.auth().signInWithPopup(provider).then(function(result){
    //         showPopup("success", "Google account sign-in successful.");
    //     }).catch(function (error) {
    //         showPopup("error", error.message);
    //     });
    // });
    //
    // signupBtn.addEventListener('click', function () {
    //     firebase.auth().createUserWithEmailAndPassword(emailInput.value, pwd_input.value).then(function(result){
    //         showPopup("success", "Sign-up successful.");
    //     }).catch(function (error) {
    //         showPopup("error", error.message);
    //         emailInput.value = "";
    //         pwd_input.value = "";
    //     });
    // });

    // Logs in when ENTER key is pressed
    $(document).keypress(function(e){
        if (e.which === 13){
            $("#login-btn").click();
        }
    });
};