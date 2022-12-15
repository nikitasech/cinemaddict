import {filter} from './../utils/filter.js';

export const generateFilters = (films) => Object
  .entries(filter)
  .map(([name, count]) => ({name, count: count(films).length}));
