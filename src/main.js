import './fonts/ys-display/fonts.css';
import './style.css';

import { initData } from './data.js';
import { processFormData } from './lib/utils.js';

import { initPagination } from './components/pagination.js';
import { initTable } from './components/table.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    // расширим существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query  = {};
  
  query = applyPagination(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySearching(query, state, action);
  query = applySorting(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);
}

// Исходные данные используемые в render()
const api = initData();

const sampleTable = initTable(
  {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination'],
  },
  render
);

const {applyPagination, updatePagination} = initPagination(sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  });

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search');

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
      searchBySeller: indexes.sellers
  });
} 

init().then(render);