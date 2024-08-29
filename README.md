I got tired of `npm install brettz9/rollup-plugin-postprocess#update --save-dev` and created my own identical fork with @brettz9's fix

More info here: https://github.com/developit/rollup-plugin-postprocess/issues/10

---

# rollup-plugin-postprocess [![npm](https://img.shields.io/npm/v/rollup-plugin-postprocess.svg?style=flat)](https://www.npmjs.org/package/rollup-plugin-postprocess) [![travis](https://travis-ci.org/developit/rollup-plugin-postprocess.svg?branch=master)](https://travis-ci.org/developit/rollup-plugin-postprocess)

Apply regex find-and-replace postprocessing to your Rollup bundle.


## Installation

`npm i -D rollup-plugin-postprocess`


## Usage

Works just like a [JavaScript String replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), including the funtion callback option.

`postprocess()` expects an Array of `[(RexExp) find, (String|Function) replace]` pairs. Alternatively, if a function is provided, it will be invoked for each bundle and can return said pairs.


## Example

```js
import postprocess from 'rollup-plugin-postprocess';

export default {
    plugins: [
        postprocess([
            [/\b(module\.exports=|export default )([a-zA-Z])/, '$1$2']
        ])
    ]
}
```


## Complex Example

This example is more practical. Rollup places exports at the end of your bundle, which can often create single-use variables that Uglify does not collapse.  Let's implement a find & replace that "moves" the export inline to save some bytes.

In this example, we'll make use of the fact that find/replacement pairs are executed in sequence. The first pair is used both to remove the existing export statement _and_ to find the export type & identifier. By the time the second find/replace pair is processed, it can make use of the values found in the first pass.

```js
import postprocess from 'rollup-plugin-postprocess';

let name, exportPrefix;
export default {
    plugins: [
        postprocess([
            [
                /(module\.exports\s*=\s*|export\s*default\s*)([a-zA-Z$_][a-zA-Z0-9$_]*)[;,]?/,
                (str, prefix, id) => {
                    name = id;
                    exportPrefix = prefix;
                    // returning nothing is the same as an empty string
                }
            ],
            [
                /^function\s([a-zA-Z$_][a-zA-Z0-9$_]*)/,
                (str, id) => id==name ? `${exportPrefix} function` : str
            ]
        ])
    ]
};
```


## License

[MIT](https://oss.ninja/mit/developit)
