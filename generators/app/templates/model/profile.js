const log = require('debug')('siemes:model:profile');
const options = require('./_options/profile');

module.exports = (app) => {
  const Plugin = app.service('Plugin');
  const Acl = app.service('Acl');
  const { profile } = app.service('config/locales/model');
  const mongoose = app.service('Mongoose');
  const { Validate } = app.service('System');
  const { Schema } = mongoose;

  const schema = Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'moderator', 'admin'] },
  }, {
    timestamps: true,
  });

  schema.set('toJSON', { virtuals: true });

  schema.path('role').set(function (newVal) {
    this._role = this.role;
    return newVal;
  });

  schema.virtual('search').get(function () {
    return `${this.name} (${this.email})`;
  });

  schema.post('save', function (user) {
    if (this._role) {
      Acl.removeUserRoles(user.id, this._role)
        .then(Acl.addUserRoles(user.id, user.role))
        .catch(log);
    }
  });

  Plugin.plugins(schema, {
    patchHistory: { name: 'user' },
    modelPatches: true,
  });

  const { adminSearch, rules } = options();
  schema.r2options = { adminSearch, attributes: profile, rules };
  Validate(schema, { attributes: profile, rules });

  const { Users } = app.service('System');
  return Users.discriminator('profile', schema);
};
