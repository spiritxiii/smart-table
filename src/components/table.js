import { cloneTemplate } from '../lib/utils.js';

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  root.container.addEventListener('change', function () {
    onAction();
  });

  root.container.addEventListener('reset', function () {
    setTimeout(onAction);
  });

  // Исправляем баг со сменой сортировки при нажатии Enter на любом input
  root.container.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.key === 'Enter') {
      e.preventDefault();
      onAction();
    }
  });
  // END Исправляем баг со сменой сортировки при нажатии Enter на любом input

  root.container.addEventListener('submit', function (e) {
    e.preventDefault();

    onAction(e.submitter);
  });

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (row.elements.hasOwnProperty(key)) {
          row.elements[key].textContent = item[key];
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
