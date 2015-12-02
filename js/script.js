
var storageCosts = {};
var persons = [];
var propTypeAccepts = {};
var propTypeNice = {};

var personTypeAmounts = {};
personTypeAmounts[1] = 0;
personTypeAmounts[2] = 0;
personTypeAmounts[3] = 0;

var goodsStartAmounts = {};
goodsStartAmounts['A'] = 0;
goodsStartAmounts['B'] = 0;
goodsStartAmounts['C'] = 0;

var goodsEndAmounts = {};
goodsEndAmounts['A'] = 0;
goodsEndAmounts['B'] = 0;
goodsEndAmounts['C'] = 0;


function getDecision(yesThreshold){
    return Math.random() <= yesThreshold;
};

var Person = function(id, type, consume, produce){
    this.id = id;
    this.type = type;
    this.consume = consume;
    this.produce = produce;
    this.good = produce;
    goodsStartAmounts[this.good] += 1;
    this.points = startPoints;
    this.pointsBeforeRound;
    this.pointsDelta = 0;
};

Person.prototype = {
    
    roundStart: function(){
        this.pointsBeforeRound = this.points;    
    },
    
    resetPointsDelta: function(){
        this.pointsDelta = 0;
    },
    
    wantTrade: function(offeredGood){
        return getDecision(propTypeAccepts[this.type + offeredGood]);
    },
    
    makeConcession: function(){
        return getDecision(propTypeNice[this.type]);
    },
    
    doTrade: function(incomingGood){
        if(incomingGood == this.consume){
            this.good = this.produce; //=incomingGood
            this.points += consumeBonus;
        }
        else
            this.good = incomingGood;
    },
    
    payStorage: function(){
        this.points -= storageCosts[this.good];
        this.pointsDelta = this.points - this.pointsBeforeRound;
    },
    
    getIdStr: function(){
        return this.id < 10 ? '0' + this.id : '' + this.id;
    },
    
    getDetails: function(){
        return '<i>[Person' + this.getIdStr() + ', type: <b>' + this.type + '</b>, good: <b>' + this.good + '</b>]</i>';
    },
    
    toString: function(){ //short toString
        return '<i>Person' + this.getIdStr() + '</i>';
    },
    
    getDeltaPointsStr: function(){
        if(this.pointsDelta == 0)
            return '';
        return '<small>(' + (this.pointsDelta < 0 ? '' + this.pointsDelta : '+' + this.pointsDelta) + ')</small>';
    },
    
    getStatus: function(){
        return '<i>Person' + this.getIdStr() + ', type: <b>' + this.type + '</b>, good: <b>' + this.good + '</b>, points: <b>' + this.points + '</b>' + this.getDeltaPointsStr() + '</i>';
    }
};


function createPersonTypeGroup(numb, personType, consumeGood, produceGood){
    for(var i = 0; i < numb; i ++){
        var p = new Person(persons.length + 1, personType, consumeGood, produceGood);
        persons.push(p);
        personTypeAmounts[personType] += 1;
        print('created ' + p.getDetails());
    };
};

function createPersons(){
    var amountOfEachType = n / 3;
    createPersonTypeGroup(amountOfEachType, 1, 'A', 'B');
    createPersonTypeGroup(amountOfEachType, 2, 'B', 'C');
    createPersonTypeGroup(amountOfEachType, 3, 'C', 'A');
};


function noTrade(){
    return '<font color="red"><b>no</b></font>, ';
};

function yesTrade(){
    return '<font color="green"><b>yes</b></font>, ';
};


function encounter(p1, p2){
    var log = 'encounter of ' + p1.getDetails() + ' and ' + p2.getDetails() + '&nbsp;&nbsp;&nbsp;<font size="2" color="gray">>></font>&nbsp;&nbsp;';
    if(p1.good == p2.good)
        log += noTrade() + "both have the same good to offer";
    else {
        var p1wantsTrade = p1.wantTrade(p2.good);
        var p2wantsTrade = p2.wantTrade(p1.good);
        
        var doTrade = p1wantsTrade && p2wantsTrade;
        if(doTrade)
            log += yesTrade() + "trade takes place because both want to";
        
        if(!p1wantsTrade && !p2wantsTrade)
            log += noTrade() + "both don't want to";
            
        if(p1wantsTrade && !p2wantsTrade){
            if(p2.makeConcession()){
                log += yesTrade() + p1 + " wants to and " + p2 + " didn't want originally but is willing to make the trade anyway";
                doTrade = true;
            }
            else
                log += noTrade() + p1 + " wants to but " + p2 + " doesn't";
        }
        
        if(!p1wantsTrade && p2wantsTrade){
            if(p1.makeConcession()){
                log += yesTrade() + p2 + " wants to and " + p1 + " didn't want originally but is willing to make the trade anyway";
                doTrade = true;
            }
            else
                log += noTrade() + p2 + " wants to but " + p1 + " doesn't";
        }
        
        if(doTrade){
            var p1_good = p1.good;
            p1.doTrade(p2.good);
            p2.doTrade(p1_good);    
        }
    }
    print(log);     
};


function showStatuses(addLineNumbers){    
    for(var i in persons){
        var lineNumb = parseInt(i) < 9 ? '&nbsp;&nbsp;' + (parseInt(i) + 1) : '' + (parseInt(i) + 1);
        print((addLineNumbers ? '<font size="2" color="gray">' + lineNumb + ':</font>&nbsp;&nbsp;' : '') + persons[i].getStatus());
        persons[i].resetPointsDelta();
    };
};


function oneRound(roundNumb){
    for(var i in persons)
        persons[i].roundStart();
    print();
    print('<b><font size="4" color="green">round ' + roundNumb + '</font></b>');
    var indize = [];
    for(var i = 0; i < n; i ++)
        indize.push(i);    
    for(var i = 0; i < n / 2; i ++){
        var randIndex = Math.abs(Math.round(Math.random() * indize.length - 0.5));    
        var p1 = persons[indize.splice(randIndex, 1)];
        randIndex = Math.abs(Math.round(Math.random() * indize.length - 0.5));    
        var p2 = persons[indize.splice(randIndex, 1)];
        encounter(p1, p2);
    };
    for(var i in persons)
        persons[i].payStorage();
    print('<font color="gray">status at end of round ' + roundNumb + ':</font>');
    showStatuses(false);
};

function runRounds(rounds){
    for(var i = 0; i < rounds; i ++)
        oneRound(i + 1);
};


function runAnalysis(){
    print('<font color="gray">final status, <b>sorted</b>:</font>');
    persons.sort(function sortFunc(p1, p2){return p2.points - p1.points;});
    showStatuses(true); 
    
    for(var i in persons)
        goodsEndAmounts[persons[i].good] += 1;
    
    var goodsPercentages = {};
    goodsPercentages['A_start'] = roundDec((goodsStartAmounts['A'] / n) * 100) + '%';
    goodsPercentages['B_start'] = roundDec((goodsStartAmounts['B'] / n) * 100) + '%';
    goodsPercentages['C_start'] = roundDec((goodsStartAmounts['C'] / n) * 100) + '%';
    goodsPercentages['A_end'] = roundDec((goodsEndAmounts['A'] / n) * 100) + '%';
    goodsPercentages['B_end'] = roundDec((goodsEndAmounts['B'] / n) * 100) + '%';
    goodsPercentages['C_end'] = roundDec((goodsEndAmounts['C'] / n) * 100) + '%';
    goodsPercentages['A_diff'] = roundDec((goodsEndAmounts['A'] / goodsStartAmounts['A']) * 100) + '%';
    goodsPercentages['B_diff'] = roundDec((goodsEndAmounts['B'] / goodsStartAmounts['B']) * 100) + '%';
    goodsPercentages['C_diff'] = roundDec((goodsEndAmounts['C'] / goodsStartAmounts['C']) * 100) + '%';

    printGoodPerformance(goodsPercentages, 'A');
    printGoodPerformance(goodsPercentages, 'B');
    printGoodPerformance(goodsPercentages, 'C');
};


function printGoodPerformance(goodsPercentages, good){
    print();
    print('<font color="green">performance of <b>good ' + good + '</b> on the market:</font>');
    if(goodsStartAmounts[good] == goodsEndAmounts[good])
        print('stayed at <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' of all goods)</small>');
    else
        print('went from <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' of all goods)</small> to <b>' + goodsEndAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_end'] + " of all goods)</small>, that's <b>" + goodsPercentages[good + '_diff'] + '</b> of the initial ' + goodsStartAmounts['A']);
};
