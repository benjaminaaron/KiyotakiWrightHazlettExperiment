
function roundDec(num){
    return Math.round(num * 10) / 10;
};

function print(str){
    var write = '&nbsp;&nbsp;&nbsp;' + (str == undefined ? '' : str) + '<br>';
    //document.getElementById('logDiv').innerHTML += write; //TODO
    document.write(write); 
};
