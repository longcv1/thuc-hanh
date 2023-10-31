const { product, clothing, electronic } = require('../../models/model.product');
const { Types } = require('mongoose');

const findAllDraftsForShop = async ({ query, limit, skip }) => {
   return await product
      .find(query)
      .populate('product_shop', 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
   return await product
      .find(query)
      .populate('product_shop', 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
   const foundShop = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
   });

   if (!foundShop) return null;

   foundShop.isDraft = false;
   foundShop.isPublished = true;

   const { modifiedCount } = await foundShop.update(foundShop);

   return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
   const foundShop = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
   });

   if (!foundShop) return null;

   foundShop.isDraft = true;
   foundShop.isPublished = false;

   const { modifiedCount } = await foundShop.update(foundShop);

   return modifiedCount;
};

const searchProductsByUser = async (keySearch) => {
   const regSearch = new RegExp(keySearch);
   const results = await product.find({
         isPublished: true,
         $text: { $search: regSearch },
      },
      { score: { $meta: 'textScore' } },
   ).sort({ score: { $meta: 'textScore' } })
   .lean();

   return results;
};

module.exports = {
   findAllDraftsForShop,
   publishProductByShop,
   findAllPublishForShop,
   unPublishProductByShop,
   searchProductsByUser
};
