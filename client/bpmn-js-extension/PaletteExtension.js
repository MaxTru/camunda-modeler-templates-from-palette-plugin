import { TEMPLATE_SYMBOL } from './TemplateSymbol';

export default class CustomPalette {
  constructor(eventBus, palette, translate) {
    this.eventBus = eventBus;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      eventBus,
      translate
    } = this;

    function createFromElementTemplate() {
      return function(event) {

        eventBus.fire('create.from-element-template', { paletteEvent: event });
      };
    }

    return {
      'create.from-element-template': {
        group: 'extension',
        imageUrl: TEMPLATE_SYMBOL,
        title: translate('Create Task from Element Template'),
        action: {
          dragstart: createFromElementTemplate(),
          click: createFromElementTemplate()
        }
      }
    };
  }
}

CustomPalette.$inject = [
  'eventBus',
  'palette',
  'translate'
];
