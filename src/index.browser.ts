import NodeFixer from './NodeFixer';

export default new NodeFixer(window.fetch.bind(window));
