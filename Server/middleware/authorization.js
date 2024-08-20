const checkRole = (role) => (req, res, next) => {
  try {
    const roles = req.decodedToken.role;
    if (roles !== role) {
      return res.status(403).json({ error: "Unauthorized !" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default checkRole;
