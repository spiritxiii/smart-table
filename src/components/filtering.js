import { createComparison, defaultRules } from '../lib/compare.js';

// настройка компаратора
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].append(
        // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
          .map((name) => {
            // используйте name как значение и текстовое содержимое
            const option = document.createElement('option'); // создали и вернули тег опции
            option.value = option.textContent = name; // <option value="name">name</option>

            return option;
          })
      );
    });

  return (data, state, action) => {
    let field = null,
      input = null;

    // обрабатываем очистку поля
    if (action && action.name == 'clear') {
      field = action.dataset.field;
      input = action.parentElement.querySelector('input');

      if (input) {
        input.value = '';
        state[field] = '';
      }
    }

    // отфильтруем данные, используя компаратор
    return data.filter((row) => compare(row, state));
  };
}
