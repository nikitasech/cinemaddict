import { render } from './render.js';
import ProfileRatingView from './views/profile-rating-view.js';
import FiltersView from './views/filters-view.js';
import FilmsModel from './models/films-model.js';
import CommentsModel from './models/comments-model.js';
import FilmsPresenter from './presenters/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmsPresenter = new FilmsPresenter();

render(new ProfileRatingView(), siteHeaderElement);
render(new FiltersView(), siteMainElement);

filmsPresenter.init(siteMainElement, filmsModel, commentsModel);
