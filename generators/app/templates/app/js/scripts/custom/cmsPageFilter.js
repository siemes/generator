import $ from 'jquery';
import selectize from './selectize';

export default () => {
  const el = $('.cms-page-filter');
  if (!el || !el.length) {
    return false;
  }

  const { object } = el.data();
  if (!object) {
    return false;
  }

  return selectize('.cms-page-filter', {
    maxItems: 1,
    score: undefined,
    onChange(elValue) {
      if (!elValue || !elValue.length) {
        return false;
      }

      const page = elValue[0];
      window.location = `${window.baseUrl}/${object}?pageFilter=${page}`;
    },
  });
};
