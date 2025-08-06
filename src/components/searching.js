import { rules, createComparison } from '../lib/compare.js';

export function initSearching(searchField) {
  // настроим компаратор
  const compare = createComparison(
    ['skipEmptyTargetValues'], // Используем только это правило из стандартных
    [
      rules.searchMultipleFields(
        searchField,
        ['date', 'customer', 'seller'],
        false
      ),
    ]
  );

  return (data, state, action) => {
    if (state[searchField]) {
      return data.filter((row) =>
        compare(row, { [searchField]: state[searchField] })
      );
    }

    return data;
  };
}
