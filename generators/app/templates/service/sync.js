module.exports = (app) => {
    const mProfile = app.service('model/profile');

    mProfile.findOrCreate({ email: 'admin@test.com' }, {
      name: 'Admin Test',
      email: 'admin@test.com',
      role: 'admin',
      passwd: 1234,
      isEnabled: true,
      isVerified: true,
    }).then().catch();
  };
