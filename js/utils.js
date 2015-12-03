
function roundDec(num, digits){
    var factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
};

function print(str){
    var write = '&nbsp;&nbsp;&nbsp;' + (str == undefined ? '' : str) + '<br>';
    //document.getElementById('logDiv').innerHTML += write; //TODO
    document.write(write); 
};
