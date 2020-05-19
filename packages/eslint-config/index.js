module.exports = {
    "plugins": [
            "promise",
            "flowtype",
            "react"
    ],
    "extends": ["airbnb",
                "plugin:promise/recommended",
                "plugin:flowtype/recommended"],

    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "impliedStrict": true,
            "jsx": true,
            "blockBindings": true,
            "modules": true,
            "arrowFunction": true
        }
    },
    "globals": {        
        "FetchResponse": "readonly",
        "SomeType": "readonly",
        "FileReader": "readonly",
        "__DEV__": "readonly",
        "BigInt": "readonly"
    },   
    "rules": {
        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "warn",
        "promise/no-promise-in-callback": "warn",
        "promise/no-callback-in-promise": "warn",
        "promise/avoid-new": "off",

        // --------------
        // Do not specify "use strict" anywhere, we are using implied strict
        // --------------
        "strict": [2, "never"],

        "comma-dangle": [2, "never"],
        "no-cond-assign": [2, "always"],
        "no-constant-condition": 2,
        "no-control-regex": 2,
        "no-debugger": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-empty-character-class": 2,
        "no-empty": 2,
        "no-ex-assign": 2,
        "no-extra-boolean-cast": 2,

        "consistent-return": 2,
        "default-case": 2,
        "dot-location": [2, "property"],
        "dot-notation": 2,
        "eqeqeq": 2,
        "guard-for-in": 2,
        "max-classes-per-file": 0,
        "no-else-return": 2,
        "no-empty-function": 2,
        "no-empty-pattern": 2,
        "no-eq-null": 2,
        "no-eval": 2,
        "no-extend-native": 2,
        "no-implicit-coercion": 2,
        "no-iterator": 2,
        "no-lone-blocks": 2,
        "no-loop-func": 2,        
        "no-native-reassign": 2,
        "no-new": 2,
        "no-new-wrappers": 2,
        "no-magic-numbers": [2, {"ignore": [-1, 0, 1, 2, 3]}],
        "no-octal": 2,
        "no-redeclare": 2,
        "no-return-assign": [0, "always"],
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-useless-concat": 2,
        "no-void": 2,
        "no-with":2,
        "radix": 2,
        "yoda": [2, "never"],

        // --------------
        // Variables
        // --------------
        "init-declarations": [2, "always"],
        "no-catch-shadow": 2,
        "no-delete-var": 2,
        "no-label-var": 2,
        "no-shadow": 2,
        "no-shadow-restricted-names": 2,
        "no-undef": 2,
        "no-undef-init": 2,
        "no-undefined": 0,
        "no-unused-vars": [2, { "argsIgnorePattern": "^_$" }],
        "no-use-before-define": 2,

        // --------------
        // Node.js and CommonJS
        // --------------
        "global-require": 2,

        // --------------
        // Stylistic
        // --------------
        "object-curly-newline": [2, {"consistent": true}],
        "prefer-destructuring": 0,
        "no-multi-spaces": 0,
        "import/prefer-default-export": 0,
        "lines-between-class-members": 0,
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-underscore-dangle": 0,
        "array-bracket-spacing": [2, "never"],
        "camelcase": 2,
        "jsx-quotes": [2, "prefer-double"],
        "no-bitwise": 1,
        "no-continue": 2,
        "no-mixed-spaces-and-tabs": 2,        
        "quotes": [2, "single"],
        "semi": 2,
        "semi-spacing" : 2,
        "brace-style": [2, "1tbs", { "allowSingleLine": true }],
        "new-cap": [2, { "capIsNewExceptions": ["Map",
                                                "Set",
                                                "List",
                                                "Some",
                                                "None",
                                                "Both",
                                                "SelectableBackground"]
                       }
                   ],
        "indent": ["error", 2, {
          "CallExpression": {"arguments": 1},
          "MemberExpression": 1,
          "FunctionExpression": {"body": 1, "parameters": 2},
          "SwitchCase": 1
        }],

        // --------------
        // ECMAScript 6
        // --------------
        "arrow-parens": [2, "always"],
        "arrow-spacing": 2,
        "constructor-super": 2,
        "no-class-assign": 2,
        "no-confusing-arrow": 2,
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-duplicate-imports": 2,
        "no-new-symbol": 2,
        "no-this-before-super": 2,
        "no-trailing-spaces": 0,
        "no-var": 2,
        "prefer-const": 2,
        "prefer-rest-params": 2,
        "prefer-spread": 2,
        "require-yield": 2,

        "import/extensions": [2, "never"]

        // Flow
        "flowtype/generic-spacing": [2, "never"],
        "flowtype/newline-after-flow-annotation": [2, "never"],
        "flowtype/no-dupe-keys": 2,
        "flowtype/no-mutable-array": 2,
        "flowtype/no-types-missing-file-annotation": 2,
        "flowtype/require-compound-type-alias": [0, "always"],
        "flowtype/require-exact-type": 0,
        "flowtype/require-inexact-type": [2, "always"],
        "flowtype/require-parameter-type": [2, { "excludeArrowFunctions": "expressionsOnly" }],
        "flowtype/require-return-type": [2, "always", { "excludeArrowFunctions": "expressionsOnly" }],
        "flowtype/require-valid-file-annotation": [2, "always", { "annotationStyle": "block" }],
        "flowtype/semi": [2, "always"],
        "flowtype/space-after-type-colon": [2, "always", { "allowLineBreak": false }],
        "flowtype/space-before-generic-bracket": [2, "never"],
        "flowtype/space-before-type-colon": [2, "never"],
        "flowtype/type-import-style": [2, "identifier"],
        "flowtype/union-intersection-spacing": [2, "always"],

        // React
        "react/boolean-prop-naming": 2,
        "react/destructuring-assignment": 0,
        "react/no-access-state-in-setstate": 2,
        "react/no-danger": 2,
        "react/no-deprecated": 2,
        "react/no-did-mount-set-state": 2,
        "react/no-direct-mutation-state": 2,
        "react/no-unsafe": [2, { "checkAliases": true }],
        "react/prefer-read-only-props": 2,
        "react/prefer-stateless-function": [2, { "ignorePureComponents": true }],        
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 2,
        "react/require-optimization": 2,        
        "react/require-render-return": 2,
        "react/sort-comp": 0,
        "react/state-in-constructor": [2, "always"],        
        "react/style-prop-object": 2,

        // React JSX
        "react/jsx-filename-extension": 0,        
        "react/jsx-no-bind": [2,  {
          "ignoreDOMComponents": false,
          "ignoreRefs": false,
          "allowArrowFunctions": false,
          "allowFunctions": false,
          "allowBind": false
        }],
        "react/jsx-no-duplicate-props": [2, { "ignoreCase": true }],
        "react/jsx-no-literals": 0,
        "react/jsx-no-target-blank": [2, { "enforceDynamicLinks": "always" }],
        "react/jsx-no-undef": 2,
        "react/jsx-one-expression-per-line": 0,

        // Fixes an error with Airbnb settings
        "generator-star-spacing": 0

    }
}

