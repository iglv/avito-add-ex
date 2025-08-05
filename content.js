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
      // Выбор категории
      if (data.category) {
        const categoryFound = highlightAndClickCategory(data.category);
        if (!categoryFound) {
          console.error('Категория не найдена:', data.category);
        }
      }

      // Заполнение названия
      setTimeout(() => {
        const titleInput = document.querySelector('input[name="title"]');
        if (titleInput) {
          typeText(titleInput, data.title);
        }

        // Заполнение описания
        const descriptionInput = document.querySelector('textarea[name="description"]');
        if (descriptionInput) {
          setTimeout(() => {
            typeText(descriptionInput, data.description);
          }, 1000);
        }
      }, 2000);
    }, 1000);

    sendResponse({status: 'ok'});
  }
});
