//models.property.belongsTo(models.property_type, {foreignKey: 'property_type_id'});
//models.property_type.hasMany(models.property, {foreignKey: 'property_type_id'});

models.EntityArea.belongsTo(models.Property, {foreignKey: 'entity_id'});
models.Property.hasMany(models.EntityArea, {foreignKey: 'entity_id'});

models.EntityArea.belongsTo(models.ExclusiveProperty, {foreignKey: 'entity_id'});
models.ExclusiveProperty.hasMany(models.EntityArea, {foreignKey: 'entity_id'});

//models.EntityArea.belongsTo(models.Precon, {foreignKey: 'entity_id'});
//models.Precon.hasMany(models.EntityArea, {foreignKey: 'entity_id'});

models.Property.hasMany(models.ResourceTemp, {foreignKey: 'entity_id'});
models.ResourceTemp.belongsTo(models.Property, {foreignKey: 'id'});

models.Precon.hasMany(models.ResourceTemp, {foreignKey: 'entity_id'});
models.ResourceTemp.belongsTo(models.Precon, {foreignKey: 'id'});

models.EntityArea.belongsTo(models.City, {foreignKey: 'area_id'});
models.City.hasMany(models.EntityArea, {foreignKey: 'area_id'});

models.EntityArea.belongsTo(models.Hood, {foreignKey: 'area_id'});
models.Hood.hasMany(models.EntityArea, {foreignKey: 'area_id'});

models.MapEntityArea.belongsTo(models.Property, {foreignKey: 'entity_id'});
models.Property.hasMany(models.MapEntityArea, {foreignKey: 'entity_id'});

models.MapEntityArea.belongsTo(models.Precon, {foreignKey: 'entity_id'});
models.Precon.hasMany(models.MapEntityArea, {foreignKey: 'entity_id'});

models.MapEntityArea.belongsTo(models.MainCity, {foreignKey: 'area_id'});
models.MainCity.hasMany(models.MapEntityArea, {foreignKey: 'area_id'});

models.MapEntityArea.belongsTo(models.MainHood, {foreignKey: 'area_id'});
models.MainHood.hasMany(models.MapEntityArea, {foreignKey: 'area_id'});

models.MapEntityArea.belongsTo(models.MainRegion, {foreignKey: 'area_id'});
models.MainRegion.hasMany(models.MapEntityArea, {foreignKey: 'area_id'});

models.MapEntityArea.belongsTo(models.MainProvince, {foreignKey: 'area_id'});
models.MainProvince.hasMany(models.MapEntityArea, {foreignKey: 'area_id'});

models.ListingChangelog.belongsTo(models.Property, {foreignKey: 'listing_id'});
models.Property.hasMany(models.ListingChangelog, {foreignKey: 'listing_id'});

models.AgentClient.belongsTo(models.AgentProfile, {foreignKey: 'agent_profile_id'});
models.AgentProfile.hasMany(models.AgentClient, {foreignKey: 'agent_profile_id'});

models.AgentLanguage.belongsTo(models.AgentProfile, {foreignKey: 'agent_profile_id'});
models.AgentProfile.hasMany(models.AgentLanguage, {foreignKey: 'agent_profile_id'});

models.UserBookmark.belongsTo(models.Property, {foreignKey: 'listing_id'});
models.Property.hasMany(models.UserBookmark, {foreignKey: 'listing_id'});

models.UserBookmark.belongsTo(models.Precon, {foreignKey: 'listing_id'});
models.Precon.hasMany(models.UserBookmark, {foreignKey: 'listing_id'});

models.UserBookmark.belongsTo(models.User, {foreignKey: 'user_id'});
models.User.hasMany(models.UserBookmark, {foreignKey: 'user_id'});

models.PropertyGeom.belongsTo(models.Property, {foreignKey: 'id'});
models.Property.hasOne(models.PropertyGeom, {foreignKey: 'property_id'});

//models.Property.belongsTo(models.ListingChangelog, {foreignKey: 'id'});
//models.ListingChangelog.hasMany(models.Property, {foreignKey: 'id'});