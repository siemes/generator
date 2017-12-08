import $ from 'jquery';
import { s3 } from 'fine-uploader/lib/s3';
import debug from 'debug';

const log = debug('cms:plugin:s3upload');

const upload = (elId, config) => {
  const { request_endpoint, signature_endpoint, key, folder } = config;
  const el = document.getElementById(elId);
  if (!el) {
    return log('element not found!');
  }

  const { parent } = $(el).data() || {};
  const uploaderParams = {
    debug: true,
    element: el,
    request: {
      endpoint: request_endpoint,
      accessKey: key,
    },
    signature: {
      endpoint: signature_endpoint,
      version: 4,
    },
    maxConnections: 1,
    objectProperties: {
      key: function (fileId) {
        return `${folder}/${this.getUuid(fileId)}---${this.getName(fileId)}`;
      },
    },
    cors: {
      expected: true,
    },
    chunking: {
      enabled: true,
    },
    resume: {
      enabled: true,
    },
    text: {
      waitingForResponse: '...',
    },
    callbacks: {
      onUploadChunk(id, name, chunkData) {
        log('[onUploadChunk, id]->', id);
        log('[onUploadChunk, name]->', name);
        log('[onUploadChunk, chunkData]->', chunkData);
      },
      onComplete: function (id, name, response) {
        log('[Upload Response]->', response);

        if (response.success) {
          log('[Upload Success]->', { id, name });
          log(this.getUuid(id));
          // save to server
          $.post('/admin/cms/upload/complete', {
            parentId: parent,
            uuid: this.getUuid(id),
            size: this.getSize(id),
            title: name,
            fullPath: this.getKey(id),
          }, (res) => {}, 'json');
        }
      },
      onError(id, name, errorReason) {
        log('[Upload Error File]->', name);
        log('[Upload Error Message]->', errorReason);
      },
    },
  };

  const uploader = new s3.FineUploader(uploaderParams);
};

export default (config) => {
  upload('fine-uploader', config);
};
