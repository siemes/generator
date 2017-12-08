module.exports = {
  vendors: [
    'jstree',
    'fine-uploader',
  ],
  vendorStyles: [
    'node_modules/jstree/dist/themes/default/style.min.css',
    'node_modules/fine-uploader/s3.fine-uploader/fine-uploader-new.css',
    'node_modules/fine-uploader/s3.fine-uploader/fine-uploader-gallery.css',
  ],
  appEntries: {
    'cms.js': ['app/js/cms.js'],
  },
};
