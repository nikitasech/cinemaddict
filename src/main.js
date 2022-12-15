import {render} from './framework/render.js';
import {generateFilters} from './mock/filter.js';
import {getUserRank} from './utils/user.js';

import FilmsModel from './models/films-model.js';
import CommentsModel from './models/comments-model.js';
import ProfileRatingView from './views/profile-rating-view.js';
import FiltersView from './views/filters-view.js';
import StatisticsView from './views/statistics-view.js';

import FilmsPresenter from './presenters/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmsPresenter = new FilmsPresenter(filmsModel, commentsModel);

const filters = generateFilters(filmsModel.films);
const profileRating = getUserRank(filmsModel.films);
const filmsCount = filmsModel.films.length;

if (profileRating) {
  render(new ProfileRatingView(profileRating), siteHeaderElement);
}

render(new FiltersView(filters), siteMainElement);
render(new StatisticsView(filmsCount), siteStatisticsElement);

filmsPresenter.init(siteMainElement);
