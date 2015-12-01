
var storageCosts = {};
var persons = [];

var goodsStartAmounts = {};
goodsStartAmounts['A'] = 0;
goodsStartAmounts['B'] = 0;
goodsStartAmounts['C'] = 0;

var goodsEndAmounts = {};
goodsEndAmounts['A'] = 0;
goodsEndAmounts['B'] = 0;
goodsEndAmounts['C'] = 0;


var PersonType = function(id, type, consume, produce){
    this.id = id;
    this.type = type;
    this.consume = consume;
    this.produce = produce;
    this.good = produce;
    goodsStartAmounts[produce] += 1;
    this.points = startPoints;
    this.pointsBeforeRound;
    this.pointsDelta = 0;
};

PersonType.prototype = {
    
    roundStart: function(){
        this.pointsBeforeRound = this.points;    
    },
    
    resetPointsDelta: function(){
        this.pointsDelta = 0;
    },
    
    wantTrade: function(offeredGood){
        //do override
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


var PersonType1 = function(id){
    PersonType.call(this, id, 1, 'A', 'B');
};

PersonType1.prototype = {
    __proto__: PersonType.prototype,
    
    wantTrade : function(offeredGood){
        switch(offeredGood){
            case 'A':
                return true;
            case 'B':
                if(this.good == 'A') // costs more to store
                    return false;
                return true;
            case 'C':
                return true;
        };
    }
};


var PersonType2 = function(id){
    PersonType.call(this, id, 2, 'B', 'C');
};

PersonType2.prototype = {
    __proto__: PersonType.prototype,
    
    wantTrade : function(offeredGood){
        switch(offeredGood){
            case 'A':
                return true;
            case 'B':
                return true;
            case 'C':
                return false;
        };
    }
};


var PersonType3 = function(id){
    PersonType.call(this, id, 3, 'C', 'A');
};

PersonType3.prototype = {
    __proto__: PersonType.prototype,
    
    wantTrade : function(offeredGood){
        switch(offeredGood){
            case 'A':
                return true;
            case 'B':
                if(this.good == 'A') // costs more to store
                    return false;
                return true;
            case 'C':
                return true;
        };
    }
};


function encounter(p1, p2){
    var log = 'encounter of ' + p1.getDetails() + ' and ' + p2.getDetails() + '&nbsp;&nbsp;&nbsp; >> &nbsp;&nbsp;';
    var p1wantsTrade = p1.wantTrade(p2.good);
    var p2wantsTrade = p2.wantTrade(p1.good);
    
    if(!p1wantsTrade && !p2wantsTrade)
        log += "no trade: both don't want to";
    if(p1wantsTrade && !p2wantsTrade)
        log += "no trade: " + p1 + " wants to, but " + p2 + " doesn't";
    if(!p1wantsTrade && p2wantsTrade)
    log += "no trade: " + p2 + " wants to, but " + p1 + " doesn't";
    
    if(p1wantsTrade && p2wantsTrade){
        if(p1.good == p2.good){
            log += "no trade: both have the same good to offer";
        }
        else {
            var p1_good = p1.good;
            p1.doTrade(p2.good);
            p2.doTrade(p1_good);    
            log += "trade takes place";
        }
    }
    print(log);     
};


function showStatuses(){    
    for(var i in persons){
        print(persons[i].getStatus());
        persons[i].resetPointsDelta();
    };
};


function createPersons(){
    for(var i = 0; i < n / 3; i ++){
        var p = new PersonType1(persons.length + 1);
        persons.push(p);
        print('<small>created ' + p.getDetails() + '</small>');
    };
    for(var i = 0; i < n / 3; i ++){
        var p = new PersonType2(persons.length + 1);
        persons.push(p);
        print('<small>created ' + p.getDetails() + '</small>');
    };
    for(var i = 0; i < n / 3; i ++){
        var p = new PersonType3(persons.length + 1);
        persons.push(p);
        print('<small>created ' + p.getDetails() + '</small>');
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
    showStatuses();
};

function runRounds(rounds){
    for(var i = 0; i < rounds; i ++)
        oneRound(i + 1);
};



function runAnalysis(){
    print('<font color="gray">final status, <b>sorted</b>:</font>');
    persons.sort(function sortFunc(p1, p2){return p2.points - p1.points;});
    showStatuses(); 
    
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
    print('went from <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' of all goods)</small> to <b>' + goodsEndAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_end'] + " of all goods)</small>, that's <b>" + goodsPercentages[good + '_diff'] + '</b> of the initial ' + goodsStartAmounts['A']);
    
};

function roundDec(num){
    return Math.round(num * 10) / 10;
};