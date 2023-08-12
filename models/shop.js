// getItemInfo function
module.exports.getItemInfo = function getItemInfo(itemId) {
    return pool
      .query("SELECT item_img, item_price, item_description FROM shop WHERE item_id = ?", [itemId])
      .then((result) => {
        const item = result[0][0];
        if (!item) throw new NotFoundError(`Item ${itemId} not found`);
        return item;
      });
  };