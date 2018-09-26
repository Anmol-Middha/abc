(function(){
var date = new Date();
for(var i=0;i<5;i++){
    var servicedate = document.getElementById("servicedate");
    var option = document.createElement("option");
    option.text= date.getDate()+i + '-' + date.getMonth() + '-' + date.getFullYear();
    option.value = date.getDate()+i + '-' + date.getMonth() + '-' + date.getFullYear();
    servicedate.add(option);
}

document.getElementById('etime').innerHTML += ' ' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();   
})()

function earliestTime(etime){
    var date = new Date();
    var edate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
    document.getElementById('servicedate').value = edate;
    console.log(edate);
    document.getElementById('servicetime').value = etime;
}