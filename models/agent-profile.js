var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var AgentProfile = sequelize.import(PATH + '/models/base/agent-profile');
  _.extend(AgentProfile.options.instanceMethods, {
    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addUrl: function () {
      this.addField('url', models.AgentProfile.getUrl(this.toJSON()));
      return this;
    },
    addProfileImage: function () {
      var self = this;
      return models.AgentProfile.getImage(this.id, 'agent_profile').then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.firstname+' '+self.lastname;
        });
        self.profile_image_src = res.shift();
        return self;
      });
    },
    addThumbImage: function () {
      var self = this;
      return models.AgentProfile.getImage(this.id, 'agent_thumb').then(function (res) {
        _.each(res, function (resource) {
          resource.alt_tag = self.firstname+' '+self.lastname;
        });
        self.thumb_image_src = res.shift();
        return self;
      });
    },
    addReviewCount: function (deleteTrace) {
      deleteTrace = (typeof deleteTrace === "undefined") ? false : true;
      this.addField('reviews_count', this.AgentClients.length);

      if(deleteTrace){
        this.deleteField('AgentClients');
      }
      return this;
    }
  });

  _.extend(AgentProfile.options.classMethods, {
    getImage: function (id, type) {
      var ResourceTemp = require(PATH + '/lib/resources/manager-temp');
      var resource = new ResourceTemp();
      return resource.getResources(id, type).then(function (res) {
        return res;
      });
    },
    getUrl: function (agent) {
      return '/real-estate-agents/' + agent.web_id + '/';
    }
  });

  AgentProfile.reinit();

  return AgentProfile;

};