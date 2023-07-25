import { Method } from '../const.js';
import ApiService from './../framework/api-service.js';

/** Модуль помогающий синхронизировать локальные данные комментариев с сервером */
export default class CommentsApiService extends ApiService {
  getItems = (filmId) => this._load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  add = async (newItem, filmId) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(newItem),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  remove = async (removedItemId) => {
    await this._load({
      url: `comments/${removedItemId}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'})
    });

  };
}
