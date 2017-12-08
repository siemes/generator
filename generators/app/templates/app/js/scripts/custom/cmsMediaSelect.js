import $ from 'jquery';
import debug from 'debug';
import 'selectize';

global.jQuery = $;
const log = debug('siemes:field:mediaSelect');

const select2nested = (data, valueField, displayField, isMultiple, prefix, initPrefix = '-', depth = 0) => {
  let r = [];
  let getPrefix = prefix;
  if (!getPrefix) {
    getPrefix = isMultiple ? '' : `${initPrefix} `;
  }

  for (const d in data) { // eslint-disable-line
    if (data.hasOwnProperty(d) && data[d][displayField]) { // eslint-disable-line
      r.push({
        [valueField]: data[d][valueField],
        [displayField]: `${getPrefix}${data[d][displayField]}`,
        data: data[d],
        itemDepth: depth,
      });

      if (data[d].children) {
        const addPrefix = isMultiple ? `${data[d][displayField]} / ` : initPrefix + getPrefix;
        r = r.concat(
          select2nested(
            data[d].children, valueField, displayField, isMultiple, addPrefix, initPrefix, depth + 1
          )
        );
      }
    }
  }

  return r;
};

const select = (el) => {
  const data = el.data();
  const { ref, display, value, qtype, placeholder, mime, mediatype } = data;
  const isMultiple = el.attr('multiple') === 'multiple';
  const { sort = display } = data;

  if (!display) {
    return log(`${ref}, data-display not found`);
  }

  return el.selectize({
    placeholder,
    valueField: '_id',
    labelField: display,
    searchField: display,
    // score: () => () => 1,
    render: {
      option(item, escape) {
        const getItem = item.data || item;
        const itemDepth = item.itemDepth || 0;

        let itemThumb;
        if (getItem.itemType === 'folder') {
          itemThumb = '<i class="color-gray400 fal fa-folder min-w1 w-auto"></i>';
        } else if (getItem.mime.includes('image')) {
          itemThumb = `<img src="/_i/thumbnail/${getItem.fullPath}" />`;
        } else {
          itemThumb = '<i class="color-gray400 fal fa-file min-w1 w-auto"></i>';
        }

        const itemInfo = getItem.itemType === 'folder'
          ? ''
          : escape(getItem.humanSize);

        return `
          <div style="padding-left: ${10 + (itemDepth * 10)}px;">
            <span>${itemThumb}</span>
            <span>${escape(getItem[display].replace(/\|/g, ' / '))}</span>
            <span><small>${itemInfo}</small></span>
          </div>
        `;
      },
      item(item, escape) {
        const getItem = item.data || item;

        let itemThumb;
        if (getItem.itemType === 'folder') {
          itemThumb = '<i class="color-gray400 fal fa-folder min-w1 w-auto"></i>';
        } else if (getItem.mime.includes('image')) {
          itemThumb = `<img src="/_i/thumbnail/${getItem.fullPath}" />`;
        } else {
          itemThumb = '<i class="color-gray400 fal fa-file min-w1 w-auto"></i>';
        }

        const itemInfo = getItem.itemType === 'folder'
          ? ''
          : escape(getItem.humanSize);

        return `
          <div>
            <span>${itemThumb}</span>
            <span>${escape(getItem[display].replace(/\|/g, ' / '))}</span>
            <span><small>${itemInfo}</small></span>
          </div>
        `;
      },
    },
    load(term, cb) {
      if (!term.length) {
        return cb();
      }
      const q = { term };
      if (mime) {
        Object.assign(q, { mime });
      }
      if (mediatype) {
        Object.assign(q, { mediaType: mediatype });
      }

      return $.get(`/admin/${ref}/search`, q, (res) => {
        cb(res.data);
      }, 'json');
    },
    onInitialize() {
      const self = this;
      const q = { limit: 100, sort };
      if (mime) {
        Object.assign(q, { mime });
      }
      if (mediatype) {
        Object.assign(q, { mediaType: mediatype });
      }

      // daha sonra condition alabilen fullArrayTree ekle
      if (qtype === 'fullArrayTree') {
        const treeObj = { qType: qtype };
        $.get(`/admin/${ref}/search`, Object.assign({}, treeObj), (res) => {
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
            self.setValue(vals);
          }
        }, 'json');
      } else {
        if (value) {
          const getIds = Object.assign({}, q, { ids: value });
          $.get(`/admin/${ref}/search`, getIds, (res) => {
            self.clear();
            const vals = [];
            res.data.forEach((item) => {
              self.updateOption(item._id, item); // eslint-disable-line
              vals.push(item._id); // eslint-disable-line
            });

            if (vals.length) {
              self.setValue(vals);
            }
          }, 'json');
        }

        $.get(`/admin/${ref}/search`, q, (res) => {
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
  });
};

export default () => {
  $('.f-cms-media-select').each(function () {
    select($(this));
  });
};
