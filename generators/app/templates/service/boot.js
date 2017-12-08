const git = require('git-rev-sync');

module.exports = function Boot(app) {
  app.use((req, res, next) => {
    try {
      res.locals.gitversion = git.long();
    } catch (e) {
      // console.log(e);
    }

    next();
  });

  return true;
};

