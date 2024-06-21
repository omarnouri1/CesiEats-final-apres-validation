import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({_id:req.body.userId});
      let cartData = await userData.cartData;
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      }
      else {
         cartData[req.body.itemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      const userId = req.body.userId;

      // Vérifier si l'ID de l'utilisateur est fourni
      if (!userId) {
         return res.status(400).json({ success: false, message: "User ID is required" });
      }

      // Rechercher l'utilisateur par son ID
      const userData = await userModel.findById(userId);

      // Vérifier si aucun utilisateur n'est trouvé
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      // Accéder à la propriété cartData de l'utilisateur
      const cartData = userData.cartData;

      // Renvoyer les données du panier de l'utilisateur
      res.json({ success: true, cartData: cartData });
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
}



export { addToCart, removeFromCart, getCart }