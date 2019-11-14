const db = require('../config/db.config.js');
const Transaction = db.transaction;


const getMostUsedCats = async (req, res) => {
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
  cats = await db.sequelize.query(sql, {
    type: db.sequelize.QueryTypes.SELECT
  }).then(
    function(categoryResult){
        //console.log("categories result: " + JSON.stringify(categoryResult));
        craig = JSON.stringify(categoryResult);
        //console.log("categories result: " + JSON.stringify(categoryResult));
        return craig;
    });;

  
  
};

export default {
  getMostUsedCats
}