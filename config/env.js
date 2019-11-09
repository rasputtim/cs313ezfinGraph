const env = {
  database: 'den57cm8t76a52',
  username: 'omeepqhqkpeace',
  password: '959fac24d270906e74f1c6ba0c36aeb13114e9347622bb110467a089659af441',
  host: 'ec2-54-225-119-13.compute-1.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
 
module.exports = env;