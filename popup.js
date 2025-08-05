document.addEventListener('DOMContentLoaded', () => {
  const fillFormButton = document.getElementById('fillForm');
  const jsonInput = document.getElementById('jsonInput');

  fillFormButton.addEventListener('click', async () => {
    try {
      // Получаем данные из текстового поля
      const data = JSON.parse(jsonInput.value);

      // Получаем активную вкладку
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

      // Если мы не на странице Авито, переходим на нее
      if (!tab.url.includes('avito.ru/additem')) {
        await chrome.tabs.update(tab.id, {url: 'https://www.avito.ru/additem'});

        // Ждем загрузки страницы
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Отправляем данные в content script
      await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: data,
      });
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка. Проверьте формат JSON данных.');
    }
  });
});
