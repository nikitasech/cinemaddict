import Observable from './../framework/observable.js';

/** Модель комментариев. */
export default class CommentsModel extends Observable {
  #apiService;
  #filmsModel;
  #items = new Map();

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  /** Возвращает комментарии к фильму
   * @param {number} filmId id нужного фильма
   * @returns {Array} список комментариев
   */
  getItems = async (filmId) => {
    if (!this.#items.get(filmId)) {
      try {
        const comments = await this.#apiService.getItems(filmId);
        this.#items.set(filmId, comments);
      } catch (err) {
        throw new Error('Failed to load comments from the server');
      }
    }

    return this.#items.get(filmId);
  };

  /** Добавляет новый комментарий
   * @param {Array} typeUpdate
   * @param {Object} newComment
   */
  addItem = async (typeUpdate, newItem, filmId) => {
    try {
      const response = await this.#apiService.add(newItem, filmId);
      const idAdapted = false;
      this.#items.set(filmId, response.comments);
      this.#filmsModel.updateItemOnClient(typeUpdate, response.movie, idAdapted);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  /** Удаляет комментарий
   * @param {Array} typeUpdate
   * @param {Object} deletedItem
   * @param {Object} film
   */
  removeItem = async (typeUpdate, removedItem, film) => {
    const newFilm = structuredClone(film);
    const filmComments = structuredClone(this.#items.get(film.id));
    const commentIndex = filmComments
      .findIndex((item) => removedItem.id === item.id);

    try {
      const isAdapted = true;

      await this.#apiService.remove(removedItem.id);
      filmComments.splice(commentIndex, 1);
      this.#items.set(film.id, filmComments);
      newFilm.comments = filmComments;
      this.#filmsModel.updateItemOnClient(typeUpdate, newFilm, isAdapted);
    } catch (err) {
      throw new Error('Can\'t remove comment');
    }
  };
}
