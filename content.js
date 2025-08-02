function selectCategory(category) {
  console.log('Ждем загрузки кнопок категорий...');

  const findAndClickCategory = () => {
    // Ищем все кнопки на странице для отладки
    const allButtons = document.querySelectorAll('button');
    console.log('Всего кнопок на странице:', allButtons.length);
    allButtons.forEach((btn) => {
      console.log('Кнопка:', {
        text: btn.textContent,
        dataMarker: btn.getAttribute('data-marker'),
        class: btn.className,
      });
    });

    const buttons = document.querySelectorAll('[data-marker="category-wizard/button"]');
    console.log('Найдено кнопок по старому селектору:', buttons.length);

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
      console.log('Категория не найдена');
      return false;
    } else {
      console.log('Кнопки еще не загрузились, ждем...');
      setTimeout(findAndClickCategory, 1000);
      return false;
    }
  };

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
      // Выведем все input'ы на странице для отладки
      const allInputs = document.querySelectorAll('input');
      console.log('Найдено инпутов на странице:', allInputs.length);
      allInputs.forEach((input) => {
        console.log('Input:', input.name, input.id, input.getAttribute('data-marker'));
      });
      setTimeout(waitForInput, 500);
    }
  };

  waitForInput();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Получено сообщение:', message);
  if (message.action === 'selectCategory') {
    selectCategory(message.category);
  } else if (message.action === 'setTitle') {
    setTitle(message.title);
  }
});
