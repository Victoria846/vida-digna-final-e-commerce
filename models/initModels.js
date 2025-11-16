// models/initModels.js

const Admin = require("./User/Admin");
const User = require("./User/User");
const UserProfile = require("./User/UserProfile");

const ProductCategory = require("./Store/ProductCategory");
const Product = require("./Store/Product");
const Order = require("./Store/Order");
const OrderItem = require("./Store/OrderItem");

const Service = require("./Service/Service");
const ServiceEnrollment = require("./Service/ServiceEnrollment");

const SubscriptionPlan = require("./Subscription/SubscriptionPlan");
const SubscriptionPlanFeature = require("./Subscription/SubscriptionPlanFeature");
const UserSubscription = require("./Subscription/UserSubscription");

const BlogPost = require("./Content/BlogPost");
const Guide = require("./Content/Guide");
const Video = require("./Content/Video");

function initModels(sequelize) {
  const models = {};

  // Init de cada modelo
  models.Admin = Admin.initModel(sequelize);
  models.User = User.initModel(sequelize);
  models.UserProfile = UserProfile.initModel(sequelize);

  models.ProductCategory = ProductCategory.initModel(sequelize);
  models.Product = Product.initModel(sequelize);
  models.Order = Order.initModel(sequelize);
  models.OrderItem = OrderItem.initModel(sequelize);

  models.Service = Service.initModel(sequelize);
  models.ServiceEnrollment = ServiceEnrollment.initModel(sequelize);

  models.SubscriptionPlan = SubscriptionPlan.initModel(sequelize);
  models.SubscriptionPlanFeature = SubscriptionPlanFeature.initModel(sequelize);
  models.UserSubscription = UserSubscription.initModel(sequelize);

  models.BlogPost = BlogPost.initModel(sequelize);
  models.Guide = Guide.initModel(sequelize);
  models.Video = Video.initModel(sequelize);

  // Associations (como ya habíamos hablado)

  // Store
  models.Product.belongsTo(models.ProductCategory, {
    foreignKey: "category_id",
    as: "category",
  });
  models.ProductCategory.hasMany(models.Product, {
    foreignKey: "category_id",
    as: "products",
  });

  models.Order.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
  models.User.hasMany(models.Order, {
    foreignKey: "user_id",
    as: "orders",
  });

  models.Order.hasMany(models.OrderItem, {
    foreignKey: "order_id",
    as: "items",
  });
  models.OrderItem.belongsTo(models.Order, {
    foreignKey: "order_id",
    as: "order",
  });

  models.OrderItem.belongsTo(models.Product, {
    foreignKey: "product_id",
    as: "product",
  });
  models.Product.hasMany(models.OrderItem, {
    foreignKey: "product_id",
    as: "orderItems",
  });

  // Users
  models.User.hasOne(models.UserProfile, {
    foreignKey: "user_id",
    as: "profile",
  });
  models.UserProfile.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Services
  models.Service.hasMany(models.ServiceEnrollment, {
    foreignKey: "service_id",
    as: "enrollments",
  });
  models.ServiceEnrollment.belongsTo(models.Service, {
    foreignKey: "service_id",
    as: "service",
  });

  models.User.hasMany(models.ServiceEnrollment, {
    foreignKey: "user_id",
    as: "serviceEnrollments",
  });
  models.ServiceEnrollment.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Subscriptions
  models.SubscriptionPlan.hasMany(models.SubscriptionPlanFeature, {
    foreignKey: "plan_id",
    as: "features",
  });
  models.SubscriptionPlanFeature.belongsTo(models.SubscriptionPlan, {
    foreignKey: "plan_id",
    as: "plan",
  });

  models.User.hasMany(models.UserSubscription, {
    foreignKey: "user_id",
    as: "subscriptions",
  });
  models.UserSubscription.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  models.SubscriptionPlan.hasMany(models.UserSubscription, {
    foreignKey: "plan_id",
    as: "userSubscriptions",
  });
  models.UserSubscription.belongsTo(models.SubscriptionPlan, {
    foreignKey: "plan_id",
    as: "plan",
  });

  return models;
}

module.exports = initModels;
