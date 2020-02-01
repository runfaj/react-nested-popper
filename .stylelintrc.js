module.exports = {
  "extends": "stylelint-config-recommended-scss",
  "plugins": [
    "stylelint-scss",
    "stylelint-order",
  ],
  "rules": { // https://stylelint.io/user-guide/rules/
    "at-rule-empty-line-before": ["always", {
      "except": ["after-same-name", "first-nested"],
      "ignoreAtRules": ["include", "extend"]
    }],
    "at-rule-semicolon-space-before": "never",
    "block-closing-brace-empty-line-before": "never",
    "color-named": "never",
    "custom-property-empty-line-before": ["always", {
      "except": [
        "after-custom-property",
        "first-nested"
      ]
    }],
    "declaration-empty-line-before": ["always", {
      "except": [
        "after-declaration",
        "first-nested"
      ]
    }],
    "font-weight-notation": "numeric",
    "indentation": 2,
    "max-empty-lines": 3,
    "max-nesting-depth": [3, {
      "ignore": ["pseudo-classes"]
    }],
    "no-descending-specificity": null,
    "no-empty-source": true,
    "no-empty-first-line": true,
    "no-missing-end-of-source-newline": true,
    "property-case": "lower",
    "rule-empty-line-before": ["always-multi-line", {
      "except": ["after-single-line-comment", "first-nested"]
    }],
    "selector-pseudo-class-no-unknown": [true, {
      "ignorePseudoClasses": ["global", "local"],
    }],
    "string-quotes": "single",
    "unit-case": "lower",

    // order plugin
    "order/order": [
      "custom-properties",
      "dollar-variables",
      "at-variables",
      "less-mixins",
      "at-rules",
      "declarations",
      "rules",
    ],
    "order/properties-alphabetical-order": true,
  }
};
