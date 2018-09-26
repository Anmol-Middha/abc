function signin(){
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'homepage',
        signInOptions: [{
          defaultCountry : 'IN',
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'invisible', // 'invisible' or 'compact'
            badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
          },
          // Leave the lines as is for the providers you want to offer your users.
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID
        }],
        // Terms of service url.
        tosUrl: null,
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
      };

      // The start method will wait until the DOM is loaded.
   
    ui.start('#firebaseui-auth-container', uiConfig);

}

function updateUrlpbrand(value){
    localStorage.setItem('pbrand', value);
    var currenturl = window.location.href;
    currenturl += '/' + value;
    window.location.href = currenturl;
}

function updateUrlpmodel(value){
    console.log(value);
    localStorage.setItem('pmodel', value);
    var currenturl = window.location.href;
    currenturl += '/' + value;
    window.location.href = currenturl;
}

(function (){
  var uid = null;
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
              document.getElementById('userid').value = user.uid;  
            }
            else{
                uid = null;
            }
        });
})();