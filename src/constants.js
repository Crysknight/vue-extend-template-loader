const TYPE_EXTEND_REGEXP = /<template type="extend">/;
const IMPORTS_REGEXP = /import (\w+) from '(.*?)'/;
const IMPORTS_REGEXP_GLOBAL = new RegExp(IMPORTS_REGEXP, 'g');
const EXTENDS_REGEXP = /(extends: (\w+)|mixins: \[(\w+)\])/;
const EXTENDER_MODES = {
    APPEND: 'append',
    PREPEND: 'prepend',
    DELETE: 'delete',
    REMOVE: 'remove',
    REPLACE: 'replace',
    AFTER: 'after',
    BEFORE: 'before'
};

module.exports = {
    TYPE_EXTEND_REGEXP,
    IMPORTS_REGEXP,
    IMPORTS_REGEXP_GLOBAL,
    EXTENDS_REGEXP,
    EXTENDER_MODES
};
