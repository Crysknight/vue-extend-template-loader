const cheerio = require('cheerio');

const { EXTENDER_MODES } = require('./constants');
const {
    APPEND,
    PREPEND,
    DELETE,
    REMOVE,
    REPLACE,
    AFTER,
    BEFORE
} = EXTENDER_MODES;

class SourceExtender {
    constructor(targetComponent, baseComponent) {
        this.targetComponent = targetComponent;
        this.baseComponent = baseComponent;
        this.init();
    }

    init() {
        const { targetComponent, baseComponent } = this;

        this.targetComponentDocument = this.wrap(targetComponent);
        this.baseComponentDocument = this.wrap(baseComponent);
        this.extenders = this.getExtenders();
    }

    extend() {
        this.applyExtenders();
        this.applyExtension();
        return this.targetComponentDocument.html();
    }

    applyExtenders() {
        this.extenders.forEach(({ mode, query, html }) => {
            if (mode === APPEND) {
                this.append(query, html);
            } else if (mode === PREPEND) {
                this.prepend(query, html);
            } else if (mode === DELETE || mode === REMOVE) {
                this.remove(query);
            } else if (mode === REPLACE) {
                this.replace(query, html);
            } else if (mode === AFTER) {
                this.after(query, html);
            } else if (mode === BEFORE) {
                this.before(query, html);
            }
        });
    }

    applyExtension() {
        this.targetComponentDocument('template').html(this.baseComponentDocument('template').html());
        this.targetComponentDocument('template').attr('type', 'extended');
    }

    wrap(markup) {
        return cheerio.load(markup, { xmlMode: true });
    }

    getExtenders() {
        return this
            .wrap(this.targetComponent)('extender')
            .toArray()
            .map(extender => {
                const wrapper = this.targetComponentDocument(extender);

                const mode = wrapper.attr('mode');
                const query = wrapper.attr('query');
                const html = wrapper.html();

                return { mode, query, html };
            });
    }

    append(query, html) {
        this.baseComponentDocument(query).append(html);
    }

    prepend(query, html) {
        this.baseComponentDocument(query).prepend(html);
    }

    remove(query) {
        this.baseComponentDocument(query).remove();
    }

    replace(query, html) {
        this.baseComponentDocument(query).replaceWith(html);
    }

    after(query, html) {
        this.baseComponentDocument(query).after(html);
    }

    before(query, html) {
        this.baseComponentDocument(query).before(html);
    }
}

module.exports = SourceExtender;
