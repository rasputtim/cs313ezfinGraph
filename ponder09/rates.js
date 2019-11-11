

    
/*
Large Envelopes (Flats)
Weight Not Over (oz.)	 
1	$1.00
2	1.15
3	1.30
4	1.45
5	1.60
6	1.75
7	1.90
8	2.05
9	2.20
10	2.35
11	2.50
12	2.65
13	2.80

*/
function getFlatPrices(w){
    var wei = Number(w);
    if (wei < 1) return 1.00;
    if (wei < 2) return 1.15;
    if (wei < 3) return 1.30;
    if (wei < 4) return 1.45;
    if (wei < 5) return 1.60;
    if (wei < 6) return 1.75;
    if (wei < 7) return 1.90;
    if (wei < 8) return 2.05;
    if (wei < 9) return 2.20;
    if (wei < 10) return 2.35;
    if (wei < 11) return 2.50;
    if (wei < 12) return 2.65;
    if (wei < 13) return 2.80;
    return 0;
}
/*
Letters (Stamped)
Weight Not Over (oz.)	 
1	$0.55
2	0.70
3	0.85
3.5	1.00
*/
function  getStampedPrice(w){
    
    var wei = Number(w);
    if (wei < 1) return 0.55;
    if (wei < 2) return 0.70;
    if (wei < 3) return 0.85;
    if (wei < 3.5) return 1.00;
    return 0;
}
/*
Letters (Metered)
Weight Not Over (oz.)	 
1	$0.50
2	0.65
3	0.80
3.5	0.95
*/
function getMeteredPrice(w) {
    var wei = Number(w);
    if (wei < 1) return 0.50;
    if (wei < 2) return 0.65;
    if (wei < 3) return 0.80;
    if (wei < 3.5) return 0.95;
    return 0;
}

/*

*/
function getFirstClass(w){
    var wei = Number(w);
    if (wei < 1) return 3.66;
    if (wei < 2) return 3.66;
    if (wei < 3) return 3.66;
    if (wei < 4) return 3.66;
    if (wei < 5) return 4.39;
    if (wei < 6) return 4.39;
    if (wei < 7) return 4.39;
    if (wei < 8) return 4.39;
    if (wei < 9) return 5.19;
    if (wei < 10) return 5.19;
    if (wei < 11) return 5.19;
    if (wei < 12) return 5.19;
    if (wei < 13) return 5.71;
    return 0;
}

function calculateRate(w,t){
    rate = 0;
    if(Number(w) > 3.5 && t < 3) t = 3;
    if(Number(w) > 13) return -1; 
    switch (Number(t)){
        case 1:
            rate = getStampedPrice(w);
            break;
        case 2:
            rate = getMeteredPrice(w);
            break;
        case 3:
            rate = getFlatPrices(w);
            break;
        case 4:
            rate = getFirstClass(w);
    }
    return rate;
}


module.exports.calculateRate = calculateRate;