import domify from 'domify';

const UNSUPPORTED_TYPES = [
  'bpmn:Process',
  'bpmn:Collaboration',
  'bpmn:SequenceFlow',
  'bpmn:MessageFlow'
];

const emptyOption = domify('<option value=""></option>');
emptyOption.innerText = '<select one>';


export default class _createTemplatedElementsService {

  constructor(bpmnFactory, canvas, commandStack, create, elementFactory, elementTemplates, eventBus) {
    this.bpmnFactory = bpmnFactory;
    this.canvas = canvas;
    this.commandStack = commandStack;
    this.create = create;
    this.elementFactory = elementFactory;
    this.elementTemplates = elementTemplates;
    this.eventBus = eventBus;

    this._elementTemplates = [];

    this.init();
  }


  init() {
    this._registerEventListener((event) => {
      this.updateElementTemplates();
      this._createDropdown();
      this._registerCreateTemplateAction(event);
    });
  }

  updateElementTemplates() {
    const {
      elementTemplates
    } = this;

    const allElementTemplates = elementTemplates.getAll('*');

    // only use element templates, which have one dedicated shapeType
    this._elementTemplates = allElementTemplates.filter(
      template => template.appliesTo.length === 1 && !UNSUPPORTED_TYPES.includes(template.appliesTo[0]));
  }

  _registerEventListener(func) {
    const {
      eventBus
    } = this;

    eventBus.once('create.from-element-template', function(event) {
      const {
        paletteEvent
      } = event;

      func(paletteEvent);
    });
  }

  _createDropdown(paletteEvent) {
    const {
      canvas,
      eventBus
    } = this;

    const container = canvas._container;

    const paletteEntryEle = container.querySelector('.djs-palette-entries [data-action="create.from-element-template"]');

    const dropDownEle = domify(
      `<div class="templates-palette-plugin"><label for="elementTemplates">Available Templates:</label>
        <select id="elementTemplates"></select>
      </div>`);

    const select = dropDownEle.querySelector('select');

    select.appendChild(emptyOption);

    this._elementTemplates.forEach((template) => {
      const option = domify(`<option value="${template.id}">${template.name}</option>`);

      select.appendChild(option);
    });

    paletteEntryEle.appendChild(dropDownEle);

    eventBus.once([ 'element.click', 'create.init' ], (context) => {
      dropDownEle.remove();

      this.init();
    });
  }

  _registerCreateTemplateAction(paletteEvent) {
    const {
      canvas
    } = this;

    const select = canvas._container.querySelector('.templates-palette-plugin select');
    console.log(select);
    select.addEventListener('change', () => this._createTemplatedElement(paletteEvent, select.value));
  }

  _createTemplatedElement(event, templateId) {
    const {
      commandStack,
      create,
      elementFactory
    } = this;

    const template = this._elementTemplates.find(temp => temp.id === templateId),
          type = template.appliesTo[0];

    const element = elementFactory.createShape({ type });

    commandStack.execute('propertiesPanel.camunda.changeTemplate', {
      element,
      newTemplate: template
    });

    create.start(event, element);
  }

}

_createTemplatedElementsService.$inject = [
  'bpmnFactory',
  'canvas',
  'commandStack',
  'create',
  'elementFactory',
  'elementTemplates',
  'eventBus'
];
