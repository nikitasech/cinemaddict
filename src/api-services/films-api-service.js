import { Method } from '../const.js';
import ApiService from './../framework/api-service.js';

/** Модуль помогающий синхронизировать локальные данные фильмов с сервером */
export default class FilmsApiService extends ApiService {
  get items() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  /** Обновляет фильм на сервере
   * @param {Object} newItem обновленный фильм
   * @returns {Object} ответ от сервера
   */
  updateItem = async (newItem) => {
    const response = await history._load({
      url: `film/${newItem.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(newItem)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (item) => item;
}
