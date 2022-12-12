import {render} from './framework/render.js';
import ProfileRatingView from './views/profile-rating-view.js';
import FiltersView from './views/filters-view.js';
import FilmsModel from './models/films-model.js';
import CommentsModel from './models/comments-model.js';
import FilmsPresenter from './presenters/films-presenter.js';
import {generateFilters} from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmsPresenter = new FilmsPresenter(filmsModel, commentsModel);
const filters = generateFilters(filmsModel.films);

render(new ProfileRatingView(), siteHeaderElement);
render(new FiltersView(filters), siteMainElement);

filmsPresenter.init(siteMainElement);
