/**
 * Created by petro on 2014-11-10.
 */
function Contact () {
}

var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when');

var apiKey = '{APIKEY}';

Contact.prototype.version = '1.0.1';

Contact.prototype.add = function (params) {
  var self = this;
  var Users = new handlers[this.version].user();
  if(params.api_key === null
      || _.isEmpty(params.apy_key)
      || typeof params.api_key === 'undefined'
  ){
    params.api_key = apiKey;
  }

  return models.ApiKey.find({
    where: {key_hash: params.api_key}
  }).then(function (result) {
    if(!result){
      return 'Invalid API key submitted';
    }

    return models.ContactSource.find({
      attributes: ['id', 'sys_name'],
      where: {sys_name: params.contact_source}

    }).then(function (contactSource){

      params.contact_source_id = contactSource.id;

    }).then(function (){

      if(params.contact_conversion_tool === null
          || _.isEmpty(params.contact_conversion_tool)
          || typeof params.contact_conversion_tool === 'undefined'
      ){
        params.contact_conversion_tool = 'contact-api';
      }

      if(typeof params.precon_id !== 'undefined'){
        var precon = models.Precon.findOne(params.precon_id).then(function (precon){
          return precon;
        });
      }else{
        delete params.precon_id;
      }

      return when(precon).then(function(precon){
        return models.ContactTool.find({where: {sys_name: params.contact_conversion_tool}}).then(function (contactTool){

          if(typeof precon !== 'undefined'){
            params.precon_is_vip = precon.dataValues.is_vip_active;
            if (!params.precon_is_vip) {
              params.precon_is_vip_subscribed = 0;
            }
          }

          params.contact_tool_id = contactTool.id;
          params.contact_funnel_id = 1; // There has only been 1 contact funnel.
          params.is_duplicate = Users.doesEmailExist(params.email, 3);
          return models.Contact.build(params).save().then(function (contact){
            contact.addEventParams(params, 'lead-request');
            var Events = new handlers[self.version].event();
            Events.create(contact.dataValues.event_params, 'lead-request');
            contact.deleteField('event_params');
            return contact;
          }).catch(function (error){
            throw error;
          });
        });
      });

    });
  });

};

exports = module.exports = Contact;
