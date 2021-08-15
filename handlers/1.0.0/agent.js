var errors = require(PATH + '/lib/errors');
var when = require('when');
function Agent () {
}

Agent.prototype.version = '1.0.0';

Agent.prototype.getAll = function (params) {
  var sqlObj = {};
  if(params.active){
    sqlObj.where = {active: params.active};
  }

  sqlObj.include = [
      {model: models.AgentLanguage, attributes: ['id', 'lang'], required: false},
      {model: models.AgentClient, attributes: ['id','name','description'], required: false}
    ];

  return models.AgentProfile.findAll(sqlObj).then(function (agentsAr) {
    return when.map(agentsAr, function (agentObj) {
      agentObj.addReviewCount(true);
      return agentObj.addProfileImage().then(function (agentObj) {
        return agentObj.addThumbImage().then(function (agentObj) {
          return agentObj.addUrl();
        });
      });
    });

  });
};

Agent.prototype.getById = function (id) {
  return models.AgentProfile.findOne({
    where: {id: id},
    include: [
      {model: models.AgentLanguage, attributes: ['id', 'lang'], required: false},
      {model: models.AgentClient, attributes: ['id','name','description'], required: false}
    ]
   }).then(function (agentObj) {
    if (!agentObj) {
      return {};
    }
    return agentObj.addProfileImage().then(function (agentObj) {
      return agentObj.addThumbImage().then(function (agentObj) {
        return agentObj.addUrl();
      });
    });

  });
};

Agent.prototype.getByWebId = function (webId) {
  return models.AgentProfile.findOne({
    where: {web_id: webId},
    doSubQuery: true,
    include: [
     {model: models.AgentLanguage, attributes: ['id', 'lang'], required: false},
     {model: models.AgentClient, attributes: ['id','name','description'], required: false}
    ]
  }).then(function (agentObj) {
    if (!agentObj) {
      return {};
    }
    return agentObj.addProfileImage().then(function (agentObj) {
      return agentObj.addThumbImage().then(function (agentObj) {
        return agentObj.addUrl();
      });
    });
  });
};

exports = module.exports = Agent;
