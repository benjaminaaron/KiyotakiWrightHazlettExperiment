
function roundDec(num, digits){
    var factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
};

function print(str, isVerbose){
    if(isVerbose && !verbose){}        
    else {
        var write = '&nbsp;&nbsp;&nbsp;' + (str == undefined ? '' : str) + '<br>';
        document.write(write); 
    }
};
