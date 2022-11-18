import ProfileRatingView from './views/profile-rating-view.js';
import { render } from './render.js';

const siteHeaderElement = document.querySelector('.header');

render(new ProfileRatingView(), siteHeaderElement);
