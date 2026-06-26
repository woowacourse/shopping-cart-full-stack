import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { COUPON_CATEGORY } from "../interfaces/coupon.interface.js";

export class ProductModel extends Model<InferAttributes<ProductModel>, InferCreationAttributes<ProductModel>> {
  declare public id: CreationOptional<number>;
  declare public name: string;
  declare public stock: number;
  declare public imageUrl: string;
  declare public price: number;
}

ProductModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false, field: "image_url" },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "products", timestamps: false },
);

export class CartItemModel extends Model<InferAttributes<CartItemModel>, InferCreationAttributes<CartItemModel>> {
  declare public id: CreationOptional<number>;
  declare public productId: number;
  declare public quantity: number;
}

CartItemModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: "product_id" },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "cart_items", timestamps: false },
);

export class CouponModel extends Model<InferAttributes<CouponModel>, InferCreationAttributes<CouponModel>> {
  declare public id: CreationOptional<number>;
  declare public couponCode: string;
  declare public name: string;
  declare public expiredDate: string;
  declare public category: string;
  declare public amount: CreationOptional<number | null>;
  declare public rate: CreationOptional<number | null>;
  declare public minOrderAmount: CreationOptional<number | null>;
  declare public usableStartAt: CreationOptional<string | null>;
  declare public usableEndAt: CreationOptional<string | null>;
}

CouponModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    couponCode: { type: DataTypes.STRING, allowNull: false, field: "coupon_code" },
    name: { type: DataTypes.STRING, allowNull: false },
    expiredDate: { type: DataTypes.STRING, allowNull: false, field: "expired_date" },
    category: {
      type: DataTypes.ENUM(...Object.values(COUPON_CATEGORY)),
      allowNull: false,
    },
    amount: { type: DataTypes.INTEGER, allowNull: true },
    rate: { type: DataTypes.INTEGER, allowNull: true },
    minOrderAmount: { type: DataTypes.INTEGER, allowNull: true, field: "min_order_amount" },
    usableStartAt: { type: DataTypes.STRING, allowNull: true, field: "usable_start_at" },
    usableEndAt: { type: DataTypes.STRING, allowNull: true, field: "usable_end_at" },
  },
  { sequelize, tableName: "coupons", timestamps: false },
);

export class CheckoutModel extends Model<InferAttributes<CheckoutModel>, InferCreationAttributes<CheckoutModel>> {
  declare public id: CreationOptional<number>;
  declare public remoteArea: boolean;
  declare public createdAt: CreationOptional<Date>;
}

CheckoutModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    remoteArea: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "remote_area" },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "created_at" },
  },
  { sequelize, tableName: "checkouts", timestamps: false },
);

export class CheckoutItemModel extends Model<
  InferAttributes<CheckoutItemModel>,
  InferCreationAttributes<CheckoutItemModel>
> {
  declare public id: CreationOptional<number>;
  declare public checkoutId: number;
  declare public productId: number;
  declare public quantity: number;
}

CheckoutItemModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    checkoutId: { type: DataTypes.INTEGER, allowNull: false, field: "checkout_id" },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: "product_id" },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "checkout_items", timestamps: false },
);

export class CheckoutCouponModel extends Model<
  InferAttributes<CheckoutCouponModel>,
  InferCreationAttributes<CheckoutCouponModel>
> {
  declare public id: CreationOptional<number>;
  declare public checkoutId: number;
  declare public couponId: number;
}

CheckoutCouponModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    checkoutId: { type: DataTypes.INTEGER, allowNull: false, field: "checkout_id" },
    couponId: { type: DataTypes.INTEGER, allowNull: false, field: "coupon_id" },
  },
  {
    sequelize,
    tableName: "checkout_coupons",
    timestamps: false,
    indexes: [{ unique: true, fields: ["checkout_id", "coupon_id"] }],
  },
);

// product가 삭제되면 이를 참조하는 장바구니/임시 주문 항목도 DB 레벨에서 함께 정리한다(ON DELETE CASCADE).
ProductModel.hasMany(CartItemModel, { foreignKey: "productId", onDelete: "CASCADE" });
CartItemModel.belongsTo(ProductModel, { foreignKey: "productId" });

CheckoutModel.hasMany(CheckoutItemModel, { foreignKey: "checkoutId", onDelete: "CASCADE" });
CheckoutItemModel.belongsTo(CheckoutModel, { foreignKey: "checkoutId" });
ProductModel.hasMany(CheckoutItemModel, { foreignKey: "productId", onDelete: "CASCADE" });
CheckoutItemModel.belongsTo(ProductModel, { foreignKey: "productId" });

CheckoutModel.hasMany(CheckoutCouponModel, { foreignKey: "checkoutId", onDelete: "CASCADE" });
CheckoutCouponModel.belongsTo(CheckoutModel, { foreignKey: "checkoutId" });
CouponModel.hasMany(CheckoutCouponModel, { foreignKey: "couponId", onDelete: "CASCADE" });
CheckoutCouponModel.belongsTo(CouponModel, { foreignKey: "couponId" });
