require(__dirname + '/../../initializer');

exports = module.exports = function (options, callback) {
  var Resource = new handlers['1.0.0'].resource();
  models.AgentProfile.findAll().then(function (agents) {
    _.each(agents, function (agent) {
      var resourceParams = {
        entity_id: agent.id,
        storage_engine: 'TRP'
      }

      if (agent.thumb_image_src) {
        var thumbParams = resourceParams;
        thumbParams.entity_type = 'agent_thumb';
        thumbParams.path = '/images/agents/'+ agent.thumb_image_src;
        Resource.createResources(thumbParams).then(function (result) {
          if (agent.profile_image_src) {
            var profileParams = resourceParams;
            profileParams.entity_type = 'agent_profile';
            profileParams.path = '/images/agents/'+ agent.profile_image_src;
            Resource.createResources(profileParams);
          }
        });
      }

    });
    callback('Done!');
  });
};