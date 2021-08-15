var environments = require(PATH + '/configuration/environments.json')
  , environment = environments[ process.env.NODE_ENV || 'production' ]
  , when = require('when')
  ;

module.exports = function (sequelize) {

  var Contact = sequelize.import(PATH + '/models/base/contact');
  _.extend(Contact.options.instanceMethods, {

    addField: function (field, value) {
      this.dataValues[field] = value;
    },
    deleteField: function (field) {
      delete(this.dataValues[field]);
    },
    addEventParams: function (params, type){

      switch(type){
        case 'lead-request':
          // maketo_event_id added in the event handler.
          // track_http_referrer: params.track_http_referrer
          var event = {
            ext_table: 'Contact',
            email: params.email,
            ext_id: this.id,
            ext_params: (params.contact_tool_name) ? JSON.stringify({contact_tool_name: params.contact_tool_name}) : null,
            track_marketo_cookie: params.track_marketo_cookie,
            track_ip: params.track_ip,
            track_browser: params.track_browser,
            track_browser_version: params.track_browser_version,
            track_os: params.track_os,
            track_os_version: params.track_os_version,
            track_landing_page: params.track_landing_url,
            track_http_referrer: params.track_http_referrer,
            track_page_url: params.track_page_url,
            track_channel: params.track_channel
          };
          break;
        default:
          break;
      }

      this.dataValues.event_params = event;

      return this;
    }
  });

  _.extend(Contact.options.classMethods, {

    compileEventParams: function (params, type){
      var event = {};
      switch(type){
        case 'lead-request':
          event = {
            ext_table: 'Contact',
            email: params.email,
            ext_id: this.id,
            ext_params: JSON.stringify({contact_tool_name: params.contact_tool_name})
          };
          break;
        default:
          break;
      }

      return event;
    }
  });

  Contact.reinit();

  return Contact;

};