
import $ from 'jquery';
import debug from 'debug';
import Sortable from 'sortablejs';

const sortable = (el) => {
  const id = el.attr('id');
  const { object, page } = el.data();

  const sortable = Sortable.create(document.getElementById(id), {
    handle: '.cms-sortable-handle',
    onStart: function (evt) {
      $('div[data-id]').css('color', 'inherit');
    },
    onEnd: function (evt) {
      const arr = sortable.toArray();
      arr.map((item, index) => {
        $.post(`${window.baseUrl}/${object}/${item}/editable?type=sortable`, {
          name: `pageOrder.${page}`,
          value: index,
          pk: item,
        }, (res) => {
          $(`div[data-id='${item}']`).css('color', '#279b61');
        }, 'json');
        return item;
      });
    },
  });
};

export default () => {
  $('.cms-sortable').each(function () {
    sortable($(this));
  });
};
