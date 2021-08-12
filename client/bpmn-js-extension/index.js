import ContextPadExtension from './ContextPadExtension';
import CreateTemplatedElementsService from './CreateTemplatedElementsService';
import PaletteExtension from './PaletteExtension';

export default {
  __init__: [ 'contextPadExtension', 'createTemplatedElementsService', 'paletteExtension' ],
  contextPadExtension: [ 'type', ContextPadExtension ],
  createTemplatedElementsService: [ 'type', CreateTemplatedElementsService ],
  paletteExtension: [ 'type', PaletteExtension]
};
