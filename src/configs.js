import {NameList, TypeList, TypeSort} from './const.js';

export const ListConfig = {
  [NameList.MAIN]: {
    TYPE: TypeList.MAIN,
    SORT: TypeSort.DEFAULT,
    PORTION_CARDS: 5
  },
  [NameList.TOP]: {
    TYPE: TypeList.EXTRA,
    SORT: TypeSort.RATING,
    PORTION_CARDS: 2
  },
  [NameList.COMMENTED]: {
    TYPE: TypeList.EXTRA,
    SORT: TypeSort.COMMENTED,
    PORTION_CARDS: 2
  }
};
