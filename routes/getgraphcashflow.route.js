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


module.exports = (app) => {

    app.get('/getgraphcashflow', function(req, res){
        var myCat = req.query.category_select;
        var myVal = req.query.period_select
        
        //console.log("SELECT CAT Value: " + myCat);
        //console.log("SELECT PERIOD Value: " + myVal);
        //if (!myCat) {
            var dates = getDates(myVal).then(function (result){
                var initialDate = result[0].initialdate;
                var finalDate = result[0].finaldate;
                var PeriodName = result[0].title;
        if(!myCat){
            stackfunctionsTransactions.transactions = function(callback) { 
                    
                var sql = 'SELECT t.*,public.ezfin_category.*  FROM ( \
                    SELECT sum (amount)as value, idcategory  FROM public.ezfin_transactions \
                    WHERE  duedate between :start_date \
                    and :end_date \
                    group by idcategory \
                        ) as t, public.ezfin_category  \
                        WHERE t.idcategory = public.ezfin_category.idcat';
            // and idcategory IN(:catlist) \
            db.sequelize.query(sql,
            { replacements: { /*catlist: [Number(myCat) , 16] , */start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
            ).then(function(transResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, transResult);
                });
            }
        }else{
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
                    
                var sql = 'SELECT t.*,public.ezfin_category.*  FROM ( \
                    SELECT sum (amount)as value, idcategory  FROM public.ezfin_transactions \
                    WHERE  duedate between :start_date \
                    and :end_date \
                    and idcategory IN(:catlist) \
                    group by idcategory \
                        ) as t, public.ezfin_category  \
                        WHERE t.idcategory = public.ezfin_category.idcat';
                
            db.sequelize.query(sql,
            { replacements: { catlist: [Number(myCat) , 16] , start_date: initialDate , end_date: finalDate }, type: db.sequelize.QueryTypes.SELECT }
            ).then(function(transResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, transResult);
                });
            }

        }
            async.parallel( stackfunctionsTransactions, function(err,result){
                
                //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
                //console.log("\n==============================================\n");
                //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
                transactions  = result.transactions;
                if(myCat) {
                    totalCredit = result.totalCredit;
                    totalDebit = result.totalDebit;
                }
                data = [];
                
                if (transactions.length > 0){
                    valuesCredit = [];
                    labelsCredit = [];
                    valuesDebit = [];
                    labelsDebit = [];
                console.log("TRANSACTION: "+ JSON.stringify(transactions));
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

                if(myCat){
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
                
                data = [{
                    values: valuesCredit,
                    labels: labelsCredit,
                    domain: {column: 0},
                    name: "Credits",
                    hoverinfo: 'label+percent+name',
                    hole: .4,
                    type: 'pie'
                    },{
                    values: valuesDebit,
                    labels: labelsDebit,
                    text: 'Debits',
                    textposition: 'inside',
                    domain: {column: 1},
                    name: 'Debits',
                    hoverinfo: 'label+percent+name',
                    hole: .4,
                    type: 'pie'
                    }];
            
                }else{
            
                }
                res.send(data);
            
            });
        
        });
        
        

    });

}