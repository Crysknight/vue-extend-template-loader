const fs = require('fs');

const SourceExtender = require('./SourceExtender');

const {
    TYPE_EXTEND_REGEXP,
    IMPORTS_REGEXP,
    IMPORTS_REGEXP_GLOBAL,
    EXTENDS_REGEXP
} = require('./constants');

class Loader {
    load(source) {
        const loader = this;

        return function(source) {
            const callback = this.async();
    
            const isTypeExtend = loader.isTypeExtend(source);
            const baseComponentPath = loader.getBaseComponentPath(source);
    
            if (isTypeExtend && baseComponentPath) {
                loader.handleExtend(this, callback, baseComponentPath, source);
            } else {
                callback(null, source);
            }
        };
    }

    async handleExtend(loaderInterface, callback, baseComponentPath, source) {
        let resolvedPath;
        try {
            resolvedPath = await this.resolvePromise(loaderInterface, baseComponentPath);
        } catch (error) {
            this.fail(callback, error, source);
            return;
        }

        const baseComponent = fs.readFileSync(resolvedPath, { encoding: 'utf-8' });
        const sourceExtender = new SourceExtender(source, baseComponent);

        const result = sourceExtender.extend();
        callback(
            null,
            result
        );
    }

    isTypeExtend(source) {
        return TYPE_EXTEND_REGEXP.test(source);
    }

    getBaseComponentPath(source) {
        const imports = this.getImports(source);
        const baseComponentName = this.getBaseComponentName(source);
        if (imports && baseComponentName) {
            const importNotation = imports.find(({ variable }) => variable === baseComponentName);
            return importNotation && importNotation.path;
        }

        return null;
    }

    getImports(source) {
        const imports = source.match(IMPORTS_REGEXP_GLOBAL);
        if (imports) {
            return imports.map(notation => {
                const [, variable, path] = notation.match(IMPORTS_REGEXP);
                return { variable, path };
            });
        }

        return null;
    }

    getBaseComponentName(source) {
        const extendMatch = source.match(EXTENDS_REGEXP);
        if (extendMatch) {
            const [, , extendNotation, mixinNotation] = extendMatch;

            return extendNotation || mixinNotation;
        }

        return null;
    }

    resolvePromise(loaderInterface, path) {
        return new Promise((resolve, reject) => {
            loaderInterface.resolve(loaderInterface.context, path, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    fail(callback, error, source) {
        callback(error, source);
    }
}

module.exports = Loader;
