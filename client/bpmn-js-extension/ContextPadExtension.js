import { TEMPLATE_SYMBOL } from './TemplateSymbol';


export default class ContextPadExtension {
  constructor(contextPad, eventBus, translate) {
    this.contextPad = contextPad;
    this.eventBus = eventBus;
    this.translate = translate;

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      eventBus,
      translate
    } = this;

    function createFromElementTemplate() {
      return function(event) {

        eventBus.fire('templates-palette-plugin.append-from-element-template', { originEvent: event, element });
      };
    }

    return {
      'templates-palette-plugin.append-from-element-template': {
        group: 'model',
        imageUrl: TEMPLATE_SYMBOL,
        title: translate('Append templated Element'),
        action: {
          click: createFromElementTemplate()
        }
      }
    };
  }
}

ContextPadExtension.$inject = [
  'contextPad',
  'eventBus',
  'translate'
];
