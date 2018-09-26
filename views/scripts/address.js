function newaddress(){
    var addressform = document.getElementById('newaddressform');
    var flat = document.createElement('input');
    var locality = document.createElement('input');
    var landmark = document.createElement('input');
    var pincode = document.createElement('input');
    var city = document.createElement('input');
    var state = document.createElement('input');
    var addresslabel = document.createElement('label');
    var home = document.createElement('input');
    var lhome = document.createElement('label');
    var work = document.createElement('input');
    var lwork = document.createElement('label');
    var other = document.createElement('input');
    var lother = document.createElement('label');
    var contbtn = document.createElement('input');

    flat.name="flat";
    locality.name="locality";
    landmark.name="landmark";
    pincode.name="pincode";
    city.name="city";
    state.name="state";
    home.name="home";
    work.name="work";
    other.name="other";
    contbtn.name="contbtn";

    home.innerHTML="Home";
    work.innerHTML="Work";
    other.innerHTML="Other";

    flat.placeholder="Flat No.";
    locality.placeholder="Locality";
    landmark.placeholder="Landmark";
    pincode.placeholder="Pincode";
    city.placeholder="City";
    state.placeholder="State";
    
    flat.type = "text";
    locality.type = "text";
    landmark.type = "text";
    pincode.type = "text";
    city.type = "text";
    state.type = "text";
    addresslabel.value = "Addresstype";
    home.type = "radio";
    work.type = "radio";
    other.type = "radio";
    contbtn.type = "submit";

    addressform.innerHTML += flat.outerHTML + locality.outerHTML + landmark.outerHTML + pincode.outerHTML + city.outerHTML + state.outerHTML + addresslabel.outerHTML + home.outerHTML + work.outerHTML + other.outerHTML + contbtn.outerHTML;

}