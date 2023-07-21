import ApiService from './../framework/api-service.js';

/** Модуль помогающий синхронизировать локальные данные комментариев с сервером */
export default class CommentsApiService extends ApiService {
  getItems = (filmId) => this._load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);
}
