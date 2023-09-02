import FilmsApiService from './api-services/films-api-service.js';
import CommentsApiService from './api-services/comments-api-service.js';

import FilmsModel from './models/films-model.js';
import CommentsModel from './models/comments-model.js';
import UserModel from './models/user-model.js';
import FiltersModel from './models/filters-model.js';
import SortModel from './models/sort-model.js';

import FilmsPresenter from './presenters/films-presenter.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import UserPresenter from './presenters/user-presenter.js';
import StatisticsPresenter from './presenters/statistics-presenter.js';

const AUTHORIZATION = 'Basic hS2sfS44wFDdsf4l1sa2j';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');

const filmsApiService = new FilmsApiService(END_POINT, AUTHORIZATION);
const commentsApiService = new CommentsApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(filmsApiService);
const commentsModel = new CommentsModel(commentsApiService, filmsModel);
const userModel = new UserModel();
const filtersModel = new FiltersModel();
const sortModel = new SortModel();

const filtersPresenter = new FiltersPresenter(filmsModel, filtersModel);
const userPresenter = new UserPresenter(userModel, filmsModel);
const filmsPresenter = new FilmsPresenter(filmsModel, filtersModel, sortModel, commentsModel);
const statisticsPresenter = new StatisticsPresenter(filmsModel);

filtersPresenter.init(siteMainElement);
userPresenter.init(siteHeaderElement);
filmsPresenter.init(siteMainElement);
statisticsPresenter.init(siteStatisticsElement);

filmsModel.init();

