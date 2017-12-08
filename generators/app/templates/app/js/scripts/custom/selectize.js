import $ from 'jquery';
import debug from 'debug';
import 'selectize';

global.jQuery = $;
const log = debug('siemes:field:selectize');

const select2nested = (data, valueField, displayField, isMultiple, prefix, initPrefix = '-') => {
  let r = [];
  let getPrefix = prefix;
  if (!getPrefix) {
    getPrefix = isMultiple ? '' : `${initPrefix} `;
  }

  for (const d in data) { // eslint-disable-line
    if (data.hasOwnProperty(d) && data[d][displayField]) { // eslint-disable-line
      r.push({ [valueField]: data[d][valueField], [displayField]: `${getPrefix}${data[d][displayField]}` });

      if (data[d].children) {
        const addPrefix = isMultiple ? `${getPrefix}${data[d][displayField]} / ` : initPrefix + getPrefix;

        r = r.concat(
          select2nested(data[d].children, valueField, displayField, isMultiple, addPrefix)
        );
      }
    }
  }

  return r;
};

const select = (el, options = {}) => {
  const data = el.data();
  const { ref, display, value, qtype, placeholder } = data;
  const isMultiple = el.attr('multiple') === 'multiple';
  const { sort = display } = data;

  if (!display) {
    return log(`${ref}, data-display not found`);
  }

  const { qFilter = {} } = options;

  const selectizeOpts = {
    placeholder,
    valueField: '_id',
    labelField: display,
    searchField: display,
    score: () => () => 1,
    load(q, cb) {
      if (!q.length) {
        return cb();
      }

      return $.get(`/admin/${ref}/search`, Object.assign({}, { term: q }, this.qFilter), (res) => {
        cb(res.data);
      }, 'json');
    },
    onInitialize() {
      const self = this;
      const q = { limit: 100, sort };
      this.el = el;
      this.qFilter = qFilter;

      if (qtype === 'fullArrayTree') {
        $.get(`/admin/${ref}/search`, Object.assign({}, { qType: 'fullArrayTree' }, this.qFilter), (res) => {
          const nested = select2nested(res.data, '_id', display, isMultiple);
          const getValue = value.split(',');
          const vals = [];
          self.clearOptions();
          nested.forEach((item) => {
            self.addOption(item);
            if (getValue.includes(item._id)) {
              vals.push(item._id);
            }
          });

          if (vals.length) {
            self.setValue(vals, true);
          }
        }, 'json');
      } else {
        if (value) {
          const getIds = Object.assign({}, q, { ids: value }, this.qFilter);
          $.get(`/admin/${ref}/search`, getIds, (res) => {
            self.clear();
            const vals = [];
            res.data.forEach((item) => {
              self.updateOption(item._id, item); // eslint-disable-line
              vals.push(item._id); // eslint-disable-line
            });

            if (vals.length) {
              self.setValue(vals, true);
            }
          }, 'json');
        }

        $.get(`/admin/${ref}/search`, Object.assign({}, q, this.qFilter), (res) => {
          if (!value) {
            self.clear();
          }

          res.data.forEach((item) => {
            self.addOption(item);
          });
        }, 'json');
      }
    },
    onFocus() {
      el.parent().addClass('fl-has-focus');
    },
    onBlur() {
      el.parent().removeClass('fl-has-focus');
    },
    onChange(elValue) {
      if (!elValue || !elValue.length) {
        return el.parent().removeClass('fl-is-active');
      }

      return el.parent().addClass('fl-is-active');
    },
  };

  // override options
  Object.assign(selectizeOpts, options);
  return el.selectize(selectizeOpts);
};

export default (selector, options) => {
  $(selector).each(function () {
    select($(this), options);
  });
};
