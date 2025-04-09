





const Comment = require("../model/Comment");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendNotification } = require("../utils/notificationService");
const Product = require("../model/Product"); // Importer Product pour récupérer le vendeur

// 🔹 Ajouter un commentaire
exports.createComment = catchAsyncError(async (req, res, next) => {
  const { product, text, rating } = req.body;

  if (!text) return next(new ErrorHandler("Le texte du commentaire est requis", 400));
  if (!product) return next(new ErrorHandler("L'identifiant du produit est requis", 400));

  // 🔹 Création du commentaire
  const comment = await Comment.create({
    user: req.user.id,
    product,
    text,
    rating: rating || 0,
  });

  // 🔹 Peupler le commentaire avec les infos utilisateur
  const populatedComment = await Comment.findById(comment._id).populate("user", "name avatar");

  // 🔹 Récupérer le vendeur du produit pour lui envoyer une notification
  const productInfo = await Product.findById(product).populate("seller", "name email");

  if (productInfo && productInfo.seller) {
    sendNotification({
      userId: productInfo.seller._id, // Envoyer au vendeur
      type: "comment",
      message: `${populatedComment.user.name} a commenté votre produit "${productInfo.name}".`,
      productId: product,
      commentId: comment._id,
    });
  }

  res.status(201).json({ success: true, comment: populatedComment });
});

// 🔹 Récupérer les commentaires d'un produit
exports.getCommentsByProduct = catchAsyncError(async (req, res, next) => {
  const comments = await Comment.find({ product: req.params.productId })
    .populate({ path: "user", select: "name avatar _id email" })
    .sort({ createdAt: -1 });

  // 🔹 Identifier si le commentaire appartient à l'utilisateur actuel
  const enhancedComments = comments.map((comment) => {
    const commentObj = comment.toObject();
    commentObj.user.isCurrentUser = req.user && comment.user._id.toString() === req.user.id;
    return commentObj;
  });

  res.status(200).json({ success: true, comments: enhancedComments });
});

// 🔹 Supprimer un commentaire
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new ErrorHandler("Commentaire non trouvé", 404));

  // 🔹 Vérifier si l'utilisateur est bien l'auteur du commentaire
  if (comment.user.toString() !== req.user.id) {
    return next(new ErrorHandler("Non autorisé à supprimer ce commentaire", 403));
  }

  await comment.deleteOne();
  res.status(200).json({ success: true, message: "Commentaire supprimé" });
});
