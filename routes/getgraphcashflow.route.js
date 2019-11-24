var moment = require('moment');
var async = require('async');
const db = require('../config/db.config.js');


const Category = db.category;
const User = db.tusuario;
const Transaction = db.transactions;
const Balview = db.balview;


async function getDates(periodId){

    sql = "select * from ezfin_balanceView WHERE idbalview = :id"
    var Result = await db.sequelize.query(sql, {
        replacements: {id: periodId},
        type: db.sequelize.QueryTypes.SELECT
      });

      return Result;
}

//get CategoryList from period




var stackfunctionsDates = {};
               
                

            

var stackfunctionsTransactions = {
    transactions: function(callback) { 
                
             Category.findAll().then(function(categoryResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, categoryResult);
                });
            }, 
    balviews: function(callback){
            Balview.findAll().then(function(balviewResult){
            //console.log("Periods result: " + JSON.stringify(balviewResult));
            var err = null;
            callback(err, balviewResult);
        });
    }
};

// works but gives me the time as well
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function getDatesArray(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


////////////// OPTION 2 ///////////
/*
return an array of dates between the startDate and stopDate
*/
function getDatesArray2(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

module.exports = (app) => {

    app.get('/getgraphcashflow', function(req, res){
        var myCat = req.query.category_select;
        var myVal = req.query.period_select
        var selectCATVal = [];
        for (i = 0; i < myCat.length; i++) { 
            
            if(Number(myCat[i]) !=0){
                selectCATVal.push(Number(myCat[i]));
            }
        }
        
        stackfunctionsDates.dates = function(callback) { 
                            
            Balview.findByPk(myVal).then(function(periodResult){
                   
                   var err = null;
                   callback(err, periodResult);
               });
           };

        stackfunctionsDates.categories = function(callback){
            var sql = "SELECT t.*,public.ezfin_category.*  FROM ( \
                SELECT MIN(idcategory) as idcat FROM public.ezfin_transactions, \
                public.ezfin_balanceview as B \
                WHERE duedate BETWEEN B.initialdate AND B.finaldate \
                AND B.idbalview = :idbalance \
                GROUP BY idcategory \
                ) as t, public.ezfin_category  \
                WHERE t.idcat = public.ezfin_category.idcat";
            db.sequelize.query(sql,
                { replacements: { idbalance: myVal }, type: db.sequelize.QueryTypes.SELECT }
                ).then(function(catResult){
                        
                        var err = null;
                        callback(err, catResult);
                    });   
    
        };

        //console.log("SELECT PERIOD Value: " + myVal);
        //if (selectCATVal.length ==0) {
        // var dates = getDates(myVal).then(function (result){
        async.parallel( stackfunctionsDates, function(err,result){
                var initialDate = result.dates.initialdate;
                var finalDate = result.dates.finaldate;
                var PeriodName = result.dates.title;

         var DatesArray = getDatesArray2(initialDate, finalDate);
         //console.log("DATES ARRAY: "+ JSON.stringify(DatesArray));
         //console.log("CATEGORY ARRAY: "+ JSON.stringify(result.categories));

         var categoryObj = result.categories;
         //console.log("CATEGORY ARRAY: "+ JSON.stringify(categoryObj));
         var categoryObj = result.categories;
         var CategoryArrayIDS = [];
         var numberOfTraces = 0;
         if(result.categories.length > 0) {
                numberOfTraces = result.categories.length;
                for( var i =0 ; i < numberOfTraces ; i++){
                    CategoryArrayIDS.push(result.categories[i].idcat);

                }

         }
        //console.log("CATEGORY ARRAY: "+ JSON.stringify(CategoryArrayIDS));
        if(selectCATVal.length ==0){  // make calculations including all categories
            stackfunctionsTransactions.transactions = function(callback) { 
                    
                var sql = 'SELECT A.*, B.name, B.icon,B.alias,B.description as catdescription, B.operation  \
                            FROM public.ezfin_transactions as A \
                            INNER JOIN   public.ezfin_category as B on  A.idcategory = B.idcat WHERE A.duedate between :start_date AND :end_date';
           
            db.sequelize.query(sql,
            { replacements: {start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
            ).then(function(transResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, transResult);
                });
            }
        }else{ //make calculations only with the selected categories 
            //(1) Get the total spent in the period
            stackfunctionsTransactions.totalCredit = function(callback) {
                
                    var sql = 'SELECT sum (a.amount)as total  FROM public.ezfin_transactions as A \
                INNER JOIN public.ezfin_category as B ON A.idcategory = B.idcat \
                WHERE  duedate between :start_date \
                    and :end_date \
                AND B.operation = 0';
                
                    db.sequelize.query(sql,
                    { replacements: {  start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
                    ).then(function(totalCredit){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, totalCredit);
                });
            }

            stackfunctionsTransactions.totalDebit = function(callback) {
                
                var sql = 'SELECT sum (a.amount)as total  FROM public.ezfin_transactions as A \
            INNER JOIN public.ezfin_category as B ON A.idcategory = B.idcat \
            WHERE  duedate between :start_date \
                and :end_date \
            AND B.operation = 1';
            
                db.sequelize.query(sql,
                { replacements: {  start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
                ).then(function(totalDebit){
                //console.log("categories result: " + JSON.stringify(categoryResult));
                var err = null;
                callback(err, totalDebit);
            });
        }
            
                
            //(2) Get data for the specified category
            stackfunctionsTransactions.transactions = function(callback) { 
                    
                var sql = 'SELECT A.*, B.name, B.icon,B.alias,B.description as catdescription, B.operation  \
                FROM public.ezfin_transactions as A \
                INNER JOIN   public.ezfin_category as B on  A.idcategory = B.idcat \
                WHERE A.duedate between :start_date AND :end_date \
                and idcategory IN(:catlist)';

                                
            db.sequelize.query(sql,
            { replacements: { catlist: selectCATVal , start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
            ).then(function(transResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, transResult);
                });
            }

        }

        // Get all Transactions data according with the selected criteria
            async.parallel( stackfunctionsTransactions, function(err,result){
                
                //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
                //console.log("\n==============================================\n");
                //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
                transactions  = result.transactions;
                if(selectCATVal.length > 0) {  // make calculations including only the selected categories. Must calculate the total spent in the period
                    totalCredit = result.totalCredit;
                    totalDebit = result.totalDebit;
                }
                var data = [];
                
                if (transactions.length > 0){
                    valuesCredit = [];
                    labelsCredit = [];
                    valuesDebit = [];
                    labelsDebit = [];
                //console.log("TRANSACTION: "+ JSON.stringify(transactions));
                for (var i = 0 ; i < transactions.length  ; i++){
                    if(transactions[i].operation == 0) {
                        valuesCredit.push(transactions[i].value); 
                        labelsCredit.push(transactions[i].alias);
                    }
                    if(transactions[i].operation == 1) {
                        valuesDebit.push(transactions[i].value); 
                        labelsDebit.push(transactions[i].alias);
                    }
                    
                }

                if(selectCATVal.length > 0){
                    var totalLocalCred = 0;
                    var totalLocalDeb = 0;
                    for (var i = 0 ; i < transactions.length  ; i++){
                        
                        if(transactions[i].operation == 0) {
                            totalLocalCred += transactions[i].value; 
                            
                        }
                        if(transactions[i].operation == 1) {
                            totalLocalDeb += transactions[i].value;  
                            
                        }
                        
                    }
                    valuesCredit.push(totalCredit[0].total-totalLocalCred); 
                    valuesDebit.push(totalDebit[0].total-totalLocalDeb); 
                    labelsCredit.push("TOTAL CREDIT");
                    labelsDebit.push("TOTAL DEBIT");
                }

                var yValues = [];
                var xValues= [];
                
                //create TRACES
                //console.log("WALKTHROUGH-------------------------------");
                // first walk through TRaces (Categorires)
                for (var i =0 ; i < numberOfTraces; i++) {
                    var yValueLine = [];
                    xValues[i] = categoryObj[i].alias;
                    //console.log("Label"+i+": "+xValues[i]);
                    myCategory = categoryObj[i].idcat;
                    //walk through Dates Array
                    for (var d=0 ; d < DatesArray.length ; d ++){
                        myDate = DatesArray[d];
                        yValueLine[d]=0;
                        
                            for (var j = 0 ; j < transactions.length  ; j++){
                               
                                if (transactions[j].duedate == myDate ){
                                //console.log("my Date"+d+": "+myDate);
                                //console.log("Due Date"+j+": "+transactions[j].duedate);
                                        //console.log("my Cat"+i+": "+myCategory);
                                        //console.log("Trans Cat id"+j+": "+transactions[j].idcategory);
                                    if (transactions[j].idcategory == myCategory) {
                                        //console.log("my Cat"+i+": "+myCategory);
                                        //console.log("Cat id"+j+": "+transactions[j].idcategory);
                                        if(transactions[j].operation == 0){
                                            yValueLine[d]+=transactions[j].amount;
                                        }
                                        else{
                                        yValueLine[d]-=transactions[j].amount;
                                    }
                                    }
                                }
                                
                                
                            }
                    }
                    //console.log("YValues: "+ JSON.stringify(yValueLine));
                    yValues.push(yValueLine);
                }
                    //create TRACES
                    for (var i =0 ; i < numberOfTraces; i++) {
                        
                        //um trace para cada data
                                                
                        var trace= {};
                        trace.x = DatesArray
                        trace.y = yValues[i];
                        trace.type = 'bar';
                        trace.name = xValues[i];
                        trace.base = 0;
                        trace.text = yValues[i].map(String); 
                        trace.textposition = 'auto';

                        
                        data.push(trace);
                    
                    }
            
                }else{
            
                }
                data.push(transactions);
                //console.log("DATA: " + JSON.stringify(data));
                res.send(data);
            
            });
        
        });  //end first async
        
        

    });

}