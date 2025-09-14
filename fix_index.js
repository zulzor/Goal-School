const fs = require('fs');
const path = require('path');

// Путь к файлу
const filePath = path.join(__dirname, 'web-export', 'index.html');

// Читаем содержимое файла
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка при чтении файла:', err);
    return;
  }

  // Находим позицию первого закрывающего тега </script>
  const firstScriptEnd = data.indexOf('</script>') + '</script>'.length;

  // Берем только часть до первого закрывающего тега </script> и добавляем правильное завершение
  const fixedContent = data.substring(0, firstScriptEnd) + '\n  </body>\n</html>';

  // Записываем исправленное содержимое обратно в файл
  fs.writeFile(filePath, fixedContent, 'utf8', err => {
    if (err) {
      console.error('Ошибка при записи файла:', err);
      return;
    }
    console.log('Файл успешно исправлен!');
  });
});
