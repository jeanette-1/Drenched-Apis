const isAdmin = (req, res, next) => {
    // Check the role of the user (admin or user)
    if (req.user.role === "admin") {
      // If the user is an admin, allow access
      return next();
    } else {
      // If not an admin, deny access
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized, you're not an admin" });
        
    }
  };
  
  module.exports = isAdmin;
  