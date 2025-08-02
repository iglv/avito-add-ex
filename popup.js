document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fillForm').addEventListener('click', async () => {
    try {
      const jsonInput = document.getElementById('jsonInput').value;
      const data = JSON.parse(jsonInput);

      // Открываем страницу добавления объявления в новой вкладке
      const newTab = await chrome.tabs.create({url: 'https://www.avito.ru/additem'});

      // Ждем загрузки страницы и выбираем категорию
      setTimeout(() => {
        chrome.tabs.sendMessage(newTab.id, {
          action: 'selectCategory',
          category: data.category,
        });

        // Ждем немного после выбора категории и вводим название
        setTimeout(() => {
          chrome.tabs.sendMessage(newTab.id, {
            action: 'setTitle',
            title: data.title,
          });
        }, 5000);
      }, 2000);
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  });
});
