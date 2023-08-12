// GET getItemInfo endpoint
router.get("/api/items/:itemId", function (req, res) {
    const itemId = req.params.itemId;
  
    getItemInfo(itemId)
      .then((item) => {
        res.json(item);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ success: false });
      });
  });
  
  
  
  module.exports = router;
  