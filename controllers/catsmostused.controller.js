const db = require('../config/db.config.js');



const getMostUsedCats = (req, res, params) => {
  // get the beginning of the current month
  let cats;

  var sql = 'SELECT t.*,public.ezfin_category.*  FROM ( \
    SELECT \
    public.ezfin_transactions.idcategory as idcat, \
    COUNT(public.ezfin_transactions.idcategory) AS value_occurrence \
     FROM  public.ezfin_transactions \
     GROUP BY public.ezfin_transactions.idcategory \
     ORDER BY value_occurrence DESC \
     LIMIT    8 ) as t, public.ezfin_category  \
     WHERE t.idcat = public.ezfin_category.idcat';
  // Use raw SQL queries to select all cars which belongs to the user
  cats = db.sequelize.query(sql, {
    type: db.sequelize.QueryTypes.SELECT
  }).then(
    function(categoryResult){
        //console.log("categories result: " + JSON.stringify(categoryResult));
        craig = JSON.stringify(categoryResult);
        //console.log("categories result: " + JSON.stringify(categoryResult));
        craig = JSON.stringify(categoryResult);
        params.catsmost= craig ;
        
        console.log("categories result: " + JSON.stringify(categoryResult));
        res.render('home',params);
    });

  
  
};

module.exports = {
  getMostUsedCats
}