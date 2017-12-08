module.exports = {
  mongodb: {
    host: '127.0.0.1',
    port: 27017,
    database: 'myApp',
    user: '',
    pass: '',
    uri: '',
    debug: true,
  },

  jwt: {
    secret: '1234',
    expiresIn: 7,
  },

  admin: {
    enabled: true,
    routes: true,
    name: 'siemes',
    secret: 'siemes',
    models: {
      page: { icon: 'file', model: 'cmsPage', path: '/admin/page?view=tree' },
      menu: { icon: 'list-alt', model: 'cmsMenu', path: '/admin/menu?view=tree' },
      media: { icon: 'folder', model: 'cmsMedia' },
      info: { icon: 'window', model: 'cmsInfo' },
    },
  },

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  s3: {
    bucket: 'myBucket',
    key: '',
    secret: '',
    region: 'us-east-1',
    s3_endpoint: 'https://s3.amazonaws.com',
    request_endpoint: 'https://myBucket.s3.amazonaws.com',
    signature_endpoint: '/admin/cms/upload/s3sign',
  },

  resize: {
    target: 's3',
    host: {
      localhost: ['dev', 's80-gc', 'h60-w80-cfill'],
    },
    named: {
      thumbnail: 's80-gc',
    },
  },
};
