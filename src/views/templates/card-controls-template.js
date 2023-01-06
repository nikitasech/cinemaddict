const createCardControlsTemplate = (className, Text) => (`
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${className.watchlist}" type="button">${Text.watchlist}</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${className.watched}" type="button">${Text.watched}</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${className.favorite}" type="button">${Text.favorite}</button>
  </div>
`);

export {createCardControlsTemplate as default};
