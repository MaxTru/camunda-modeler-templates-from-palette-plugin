import { TEMPLATE_SYMBOL } from './TemplateSymbol';


export default class PaletteExtension {
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

        eventBus.fire('templates-palette-plugin.create-from-element-template', { originEvent: event });
      };
    }

    return {
      'templates-palette-plugin.create-from-element-template': {
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

PaletteExtension.$inject = [
  'eventBus',
  'palette',
  'translate'
];
