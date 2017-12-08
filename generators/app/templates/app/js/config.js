export default () => {
  return {
    key: '',
    region: 'us-east-1',
    folder: 'prod',
    s3_endpoint: 'https://s3.amazonaws.com',
    request_endpoint: 'https://myBucket.s3.amazonaws.com',
    signature_endpoint: '/admin/cms/upload/s3sign',
  };
};
