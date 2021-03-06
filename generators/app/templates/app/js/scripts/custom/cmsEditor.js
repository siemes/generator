import $ from 'jquery';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/save';
import 'tinymce/plugins/table';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/template';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/placeholder';

window.tinymce = tinymce;

function myFileBrowser(fieldName, url, type, win) {
  tinymce.activeEditor.windowManager.open({
    file: `/admin/media?windowType=editor&field=${fieldName}`,
    title: 'File Browser',
    // width: 420,
    // height: 400,
    resizable: 'yes',
    inline: 'yes',  // This parameter only has an effect if you use the inlinepopups plugin!
    close_previous: 'no',
    onPostRender: function (a) {
      const el = $(a.target.$el);
      el.attr('file', 'browser');
    },
  }, {
    window: win,
    input: fieldName,
  });

  return false;
}

const richText = (selector) => {
  tinymce.init({
    selector,
    height: '240',
    skin: false,
    menubar: false,
    content_css: '/assets/css/richText.css?v=2',
    file_browser_callback: myFileBrowser,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template paste textcolor placeholder',
    ],
    toolbar: 'undo redo bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | print preview | forecolor backcolor',
    setup(editor) {
      editor.on('focus', function () {
        $(`#${$(this)[0].id}`).parent().addClass('fl-is-active').addClass('fl-has-focus');
      });

      editor.on('blur', function () {
        $(`#${$(this)[0].id}`).parent().removeClass('fl-has-focus');
      });
    },
  });
};

export default () => {
  richText('.f-cms-editor');
};
