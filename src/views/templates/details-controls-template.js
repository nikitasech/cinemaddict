const createDetailsControlsTemplate = (className, Text) => (`
  <section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist ${className.watchlist}" id="watchlist" name="watchlist">${Text.watchlist}</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched ${className.watched}" id="watched" name="watched">${Text.watched}</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${className.favorite}" id="favorite" name="favorite">${Text.favorite}</button>
  </section>
`);

export {createDetailsControlsTemplate as default};
