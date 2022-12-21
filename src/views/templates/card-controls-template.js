const createCardControlsTemplate = (ClassName, Text) => (`
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${ClassName.watchlist}" type="button">${Text.watchlist}</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${ClassName.watched}" type="button">${Text.watched}</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${ClassName.favorite}" type="button">${Text.favorite}</button>
  </div>
`);

export {createCardControlsTemplate as default};
