function selectCategory(category) {
  console.log('Ждем загрузки кнопок категорий...');

  const findAndClickCategory = () => {
    const buttons = document.querySelectorAll('[data-marker="category-wizard/button"]');
    console.log('Найдено кнопок:', buttons.length);

    if (buttons.length > 0) {
      console.log('Ищем категорию:', category);
      for (const button of buttons) {
        console.log('Проверяем кнопку:', button.textContent);
        if (button.textContent.includes(category)) {
          console.log('Нашли нужную категорию, кликаем');
          button.click();
          return true;
        }
      }
      console.log('Категория не найдена, пробуем еще раз через 1 секунду');
      setTimeout(findAndClickCategory, 1000);
      return false;
    } else {
      console.log('Кнопки еще не загрузились, ждем...');
      setTimeout(findAndClickCategory, 1000);
      return false;
    }
  };

  // Создаем MutationObserver для отслеживания изменений в DOM
  const observer = new MutationObserver((mutations, obs) => {
    const buttons = document.querySelectorAll('[data-marker="category-wizard/button"]');
    if (buttons.length > 0) {
      findAndClickCategory();
      obs.disconnect(); // Отключаем observer после нахождения кнопок
    }
  });

  // Начинаем наблюдение за изменениями в DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Также пробуем найти категорию сразу
  findAndClickCategory();
}

function setTitle(title) {
  console.log('Ждем появления поля ввода...');

  const waitForInput = () => {
    const titleInput = document.querySelector('input[name="title"]');
    if (titleInput) {
      console.log('Поле найдено, начинаем ввод');
      let currentText = '';
      const typeChar = (index) => {
        if (index < title.length) {
          currentText += title[index];
          titleInput.value = currentText;
          titleInput.dispatchEvent(new Event('input', {bubbles: true}));
          setTimeout(() => typeChar(index + 1), 100);
        }
      };
      typeChar(0);
    } else {
      console.log('Поле пока не появилось, ждем...');
      setTimeout(waitForInput, 500);
    }
  };

  waitForInput();
}

// Ждем полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Получено сообщение:', message);
    if (message.action === 'selectCategory') {
      selectCategory(message.category);
    } else if (message.action === 'setTitle') {
      setTitle(message.title);
    }
  });
});
