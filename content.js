// Функция для имитации человеческого ввода
function typeText(element, text) {
  const delay = Math.random() * (200 - 100) + 100; // Случайная задержка между 100-200мс

  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      element.value = text.substring(0, i + 1);
      element.dispatchEvent(new Event('input', {bubbles: true}));
    }, delay * i);
  }
}

// Функция для подсветки и клика по категории
function highlightAndClickCategory(categoryName) {
  const buttons = document.querySelectorAll('[data-marker="category-wizard/button"]');
  let categoryButton = null;

  buttons.forEach((button) => {
    if (button.textContent.trim() === categoryName) {
      categoryButton = button;
      button.style.backgroundColor = '#ffeb3b';
      setTimeout(() => {
        button.style.backgroundColor = '';
        button.click();

        // После клика ждем появления подкатегорий и выбираем первую
        setTimeout(() => {
          console.log('Ищем подкатегории...');
          // Ищем поле с подкатегориями
          const categoryButtons = document.querySelectorAll('[data-marker="field"] button[data-marker="category-title"]');
          console.log('Найдено подкатегорий:', categoryButtons.length);
          
          if (categoryButtons.length > 0) {
            const firstButton = categoryButtons[0];
            console.log('Текст первой подкатегории:', firstButton.textContent);

            firstButton.style.backgroundColor = '#ffeb3b';
              setTimeout(() => {
                firstButton.style.backgroundColor = '';
                firstButton.click();
                console.log('Кликнули по первой подкатегории');
              }, 1000);
            }
          } else {
            console.log('Контейнер подкатегорий не найден!');
          }
        }, 2500);
      }, 1000);
    }
  });

  return categoryButton !== null;
}

// Слушатель сообщений от popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    const data = request.data;

    // Ждем загрузки формы
    setTimeout(() => {
      console.log('Начинаем заполнение формы...');

      // Заполнение названия
      const titleInput = document.querySelector('input[name="title"]');
      if (titleInput) {
        console.log('Заполняем название...');
        typeText(titleInput, data.title);

        // После заполнения названия ждем и кликаем по категории
        setTimeout(() => {
          console.log('Пробуем выбрать категорию...');
          if (data.category) {
            const categoryFound = highlightAndClickCategory(data.category);
            if (!categoryFound) {
              console.error('Категория не найдена:', data.category);
            }
          }

          // Заполнение описания
          setTimeout(() => {
            const descriptionInput = document.querySelector('textarea[name="description"]');
            if (descriptionInput) {
              console.log('Заполняем описание...');
              typeText(descriptionInput, data.description);
            }
          }, 1000);
        }, 2000);
      }
    }, 1000);

    sendResponse({status: 'ok'});
  }
});
