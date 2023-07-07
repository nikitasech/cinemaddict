import {render} from './framework/render.js';
import {getUserRank} from './utils/user.js';

import FilmsModel from './models/films-model.js';
import CommentsModel from './models/comments-model.js';
import FiltersModel from './models/filters-model.js';
import SortModel from './models/sort-model.js';

import FilmsPresenter from './presenters/films-presenter.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import SortPresenter from './presenters/sort-presenter.js';

import ProfileRatingView from './views/profile-rating-view.js';
import StatisticsView from './views/statistics-view.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const filtersModel = new FiltersModel(filmsModel.items);
const sortModel = new SortModel();
const commentsModel = new CommentsModel();

const sortPresenter = new SortPresenter(sortModel);
const filtersPresenter = new FiltersPresenter(filmsModel, filtersModel);
const filmsPresenter = new FilmsPresenter(filmsModel, filtersModel, sortModel, commentsModel);

const profileRating = getUserRank(filmsModel.items);
const filmsCount = filmsModel.items.length;

if (profileRating) {
  render(new ProfileRatingView(profileRating), siteHeaderElement);
}

filtersPresenter.init(siteMainElement);
sortPresenter.init(siteMainElement);
render(new StatisticsView(filmsCount), siteStatisticsElement);
filmsPresenter.init(siteMainElement);
