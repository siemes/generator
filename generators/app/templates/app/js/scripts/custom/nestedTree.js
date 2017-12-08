import $ from 'jquery';
import 'jstree';

const tree = (el) => {
  const { lang, locales } = el.data();

  const items = {};

  if (locales && locales.length) {
    locales.reduce((acc, prev) => {
      return Object.assign(acc, {
        [`editItem-${prev}`]: {
          label: `${lang.tree.edit} (${prev})`,
          action(obj) {
            const { url, nested } = $(obj.reference).parent().data();
            window.location = `${url}/${nested}?lang=${prev}`;
          },
        },
        [`newItem-${prev}`]: {
          label: `${lang.tree.new} (${prev})`,
          action(obj) {
            const { url, nested } = $(obj.reference).parent().data();
            window.location = `${url}/new?parent=${nested}&lang=${prev}`;
          },
        },
      });
    }, items);
  }

  el.jstree({
    plugins: ['types', 'dnd', 'contextmenu'],
    types: {
      default: {
        icon: 'glyphicon glyphicon-menu-right',
      },
    },
    core: {
      check_callback: true,
      dblclick_toggle: false,
    },
    contextmenu: {
      items,
    },
  }).on('dblclick.jstree', function (e) {
    const node = $(e.target).closest('li');
    const { url, nested } = node.data();
    window.location = `${url}/${nested}`;
  }).on('move_node.jstree', function (e, data) {
    if (data.parent === '#') {
      return;
    }

    if ((data.parent !== data.old_parent) || (data.position !== data.old_position)) {
      const parent = data.instance.get_node(data.parent);
      const children = parent.children;

      children.forEach(function (v, i) {
        const childData = data.instance.get_node(v);
        const put = {
          parentId: parent.data.nested,
          _w: i + 1,
        };

        $.ajax({
          method: 'POST',
          url: `${childData.data.url}/${childData.data.nested}`,
          data: put,
        })
          .done(function (msg) {});
      });
    }
  });
};

export default () => {
  $('.category-list').each(function () {
    tree($(this));
  });
};
