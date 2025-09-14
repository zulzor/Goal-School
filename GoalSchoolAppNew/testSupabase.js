const { supabase } = require('./src/config/supabase.ts');

async function testConnection() {
  console.log('Тестирование подключения к Supabase...');

  try {
    // Тест подключения к базе данных
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('Ошибка подключения к Supabase:', error);
      return false;
    }

    console.log('Подключение к Supabase успешно!');
    console.log('Данные получены:', data);
    return true;
  } catch (error) {
    console.error('Критическая ошибка:', error);
    return false;
  }
}

testConnection();
