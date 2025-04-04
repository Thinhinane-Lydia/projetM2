// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  if (!user || !user._id) {
      return res.status(500).json({ success: false, message: "Erreur: Utilisateur invalide." });
  }
  
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "PRODUCTION",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;