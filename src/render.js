const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * Создает и возвращает DOM-разметку на
 * основе принятого текстового шаблона.
 * @param {string} template Разметка в текстовом формате.
 * @return {nodeObject} DOM-узел.
 */
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

/**
 * Отрисовывает разметку в нужном месте указанного контейнера.
 * Позиция может быть:
 * - 'beforebegin' - перед контейнером;
 * - 'afterbegin' - в начале контейнера;
 * - 'beforeend' - в конце контейнера;
 * - 'afterend' - после контейнера.
 * @param {nodeObject} component DOM-узел для вставки.
 * @param {nodeObject} container Контейнер.
 * @param {string=} place Позиция. По умолчанию в конце контейнера.
 */
const render = (component, container, place = RenderPosition.BEFOREEND) => {
  container.insertAdjacentElement(place, component.getElement());
};

export {RenderPosition, createElement, render};
