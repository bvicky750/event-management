import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool;

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: config.db.waitForConnections,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
      decimalNumbers: config.db.decimalNumbers,
      timezone: '+00:00',
      dateStrings: true
    });
  }
  return pool;
};

export const query = async (sql, params = []) => {
  const connectionPool = getPool();
  const [results] = await connectionPool.query(sql, params);
  return results;
};

export const testConnection = async () => {
  try {
    const connectionPool = getPool();
    const connection = await connectionPool.getConnection();
    console.log(`[Database] Successfully connected to MySQL database: "${config.db.database}" on ${config.db.host}:${config.db.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    return false;
  }
};

export default {
  getPool,
  query,
  testConnection
};
