import { Method } from './../const.js';
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
    const response = await this._load({
      url: `movies/${newItem.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(newItem)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer(item) {
    const adaptedItem = {
      ...item,
      ['film_info']: {
        ...item.info,
        ['alternative_title']: item.info.alternativeTitle,
        ['total_rating']: item.info.totalRating,
        ['age_rating']: item.info.ageRating,
        ['release']: {
          ...item.info.release,
          ['release_country']: item.info.release.country
        }
      },
      ['user_details']: {
        ...item.userDetails,
        ['already_watched']: item.userDetails.alreadyWatched,
        ['watching_date']: item.userDetails.watchingDate
      }
    };

    delete adaptedItem.info;
    delete adaptedItem.userDetails;
    delete adaptedItem['film_info'].alternativeTitle;
    delete adaptedItem['film_info'].totalRating;
    delete adaptedItem['film_info'].ageRating;
    delete adaptedItem['film_info']['release'].country;
    delete adaptedItem['user_details'].alreadyWatched;
    delete adaptedItem['user_details'].watchingDate;

    return adaptedItem;
  }
}
