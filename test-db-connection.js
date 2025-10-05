#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to DigitalOcean Managed PostgreSQL
 */

const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: 'db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com',
  port: 25060,
  database: 'arunz_cricklog_dev',
  user: 'arunz_developer',
  password: process.env.DB_PASSWORD || 'your_password_here',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
};

async function testConnection() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔄 Testing database connection...');
    console.log(`📡 Host: ${dbConfig.host}`);
    console.log(`🔌 Port: ${dbConfig.port}`);
    console.log(`🗄️  Database: ${dbConfig.database}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
    
    // Test database permissions
    const permissions = await client.query(`
      SELECT 
        has_database_privilege($1, 'CONNECT') as can_connect,
        has_database_privilege($1, 'CREATE') as can_create,
        has_database_privilege($1, 'TEMPORARY') as can_temp
    `, [dbConfig.database]);
    
    console.log('🔐 Database permissions:');
    console.log(`  • Can connect: ${permissions.rows[0].can_connect ? '✅' : '❌'}`);
    console.log(`  • Can create: ${permissions.rows[0].can_create ? '✅' : '❌'}`);
    console.log(`  • Can create temp tables: ${permissions.rows[0].can_temp ? '✅' : '❌'}`);
    
    // Test table creation (if permissions allow)
    if (permissions.rows[0].can_create) {
      console.log('🧪 Testing table creation...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS connection_test (
          id SERIAL PRIMARY KEY,
          test_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          message TEXT
        )
      `);
      
      await client.query(`
        INSERT INTO connection_test (message) VALUES ('Database connection test successful')
      `);
      
      const testResult = await client.query('SELECT * FROM connection_test ORDER BY test_time DESC LIMIT 1');
      console.log('✅ Test table created and data inserted successfully');
      console.log(`📝 Test message: ${testResult.rows[0].message}`);
      
      // Clean up test table
      await client.query('DROP TABLE connection_test');
      console.log('🧹 Test table cleaned up');
    }
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused - check if the database host and port are correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 Host not found - check if the database hostname is correct');
    } else if (error.code === '28P01') {
      console.error('💡 Authentication failed - check username and password');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist - check database name');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection().catch(console.error);
