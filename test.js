/* eslint-disable */

const assert = require('assert');
const postprocess = require('.');

const code = 'function t(t,o,e,i){for(i=0,o=o.split?o.split("."):o;t&&i<o.length;)t=t[o[i++]];return void 0===t?e:t}module.exports=t;';

let name, exportPrefix;
let out = postprocess([
	[/(module\.exports\s*=\s*|export\s*default\s*)([a-zA-Z$_][a-zA-Z0-9$_]*)[;,]?/, function(str, prefix, id) {
		name = id;
		exportPrefix = prefix;
	}],
	[/^function\s([a-zA-Z$_][a-zA-Z0-9$_]*)/, function(str, id) {
		if (id===name) {
			return exportPrefix + str;
		}
		return str;
	}]
]).renderChunk(code, { sourceMap: false });

assert.equal(out.code, 'module.exports=function t(t,o,e,i){for(i=0,o=o.split?o.split("."):o;t&&i<o.length;)t=t[o[i++]];return void 0===t?e:t}');

out = postprocess([
	[/module\.exports=(.*)/, '// EXPORT\n\nmodule\.exports=$1\n// end of file']
]).renderChunk(code, {});

assert.equal(out.code, 'function t(t,o,e,i){for(i=0,o=o.split?o.split("."):o;t&&i<o.length;)t=t[o[i++]];return void 0===t?e:t}// EXPORT\n\nmodule.exports=t;\n// end of file')

console.log('✅ Tests Passed');
process.exit(0);
