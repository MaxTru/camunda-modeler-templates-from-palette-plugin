import domify from 'domify';

const UNSUPPORTED_TYPES = [
  'bpmn:Process',
  'bpmn:Collaboration',
  'bpmn:SequenceFlow',
  'bpmn:MessageFlow'
];

const APPEND_ACTION = 'templates-palette-plugin.append-from-element-template';
const CREATE_ACTION = 'templates-palette-plugin.create-from-element-template';

const emptyOption = domify('<option value=""></option>');
emptyOption.innerText = '<select one>';


export default class _createTemplatedElementsService {

  constructor(autoPlace, bpmnFactory, canvas, commandStack, create, elementFactory, elementTemplates, eventBus) {
    this.autoPlace = autoPlace;
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
    this._registerEventListener((event, element) => {
      this.updateElementTemplates();
      this._createDropdown(event);
      this._registerCreateTemplateAction(event, element);
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

    eventBus.once([ CREATE_ACTION, APPEND_ACTION ], function(event) {
      const {
        originEvent,
        element
      } = event;

      func(originEvent, element);
    });
  }

  _createDropdown(event) {
    const {
      eventBus
    } = this;

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

    event.delegateTarget.appendChild(dropDownEle);

    eventBus.once([ 'element.click', 'create.init' ], (context) => {
      dropDownEle.remove();

      this.init();
    });
  }

  _registerCreateTemplateAction(event, element) {
    const {
      canvas
    } = this;

    const select = canvas._container.querySelector('.templates-palette-plugin select');
    select.addEventListener('change', () => this._createTemplatedElement(event, element, select.value));
  }

  _createTemplatedElement(event, element, templateId) {
    const {
      autoPlace,
      commandStack,
      create,
      elementFactory
    } = this;

    const action = event.delegateTarget.getAttribute('data-action');

    const template = this._elementTemplates.find(temp => temp.id === templateId),
          type = template.appliesTo[0];

    const shape = elementFactory.createShape({ type });

    commandStack.execute('propertiesPanel.camunda.changeTemplate', {
      element: shape,
      newTemplate: template
    });

    if (action === CREATE_ACTION) {
      create.start(event, shape);
    } else if (action === APPEND_ACTION) {
      autoPlace.append(element, shape);
    }

  }

}

_createTemplatedElementsService.$inject = [
  'autoPlace',
  'bpmnFactory',
  'canvas',
  'commandStack',
  'create',
  'elementFactory',
  'elementTemplates',
  'eventBus'
];
