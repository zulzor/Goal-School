// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'mrzulonz.beget.tech',
      port: 3306,
      user: 'mrzulonz_ars',
      password: 'VJiPwM!po5Z1',
      database: 'mrzulonz_ars',
    });

    const [rows] = await connection.query('SELECT NOW()');
    console.log('✅ Успешное подключение! Сервер вернул:', rows);

    await connection.end();
  } catch (err) {
    console.error('❌ Ошибка подключения:', err.message);
  }
}

testConnection();
