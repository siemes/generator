const { Schema } = require('querymen');

module.exports = () => (
  {
    adminSearch() {
      const q = new Schema();
      q.param('qType', null, { type: String, enum: ['all', 'allTotal', 'one', 'total'] });
      q.param('limit', 10, { type: Number, max: 100 });
      q.param('sort', '-_id');
      q.param('roles', null, { multiple: true, paths: ['role'], operator: '$in' });

      q.param('term', null).option('searchParser', 'prop');
      q.parser('searchParser', (prop, value) => (
        {
          $or: [{ name: new RegExp(value, 'i') }, { email: new RegExp(value, 'i') }],
        }
      ));

      return q;
    },
  }
);
