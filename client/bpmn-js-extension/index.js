import CreateTemplatedElementsService from './CreateTemplatedElementsService';
import PaletteExtension from './PaletteExtension';

export default {
  __init__: [ 'createTemplatedElementsService', 'paletteExtension' ],
  createTemplatedElementsService: [ 'type', CreateTemplatedElementsService ],
  paletteExtension: [ 'type', PaletteExtension]
};
