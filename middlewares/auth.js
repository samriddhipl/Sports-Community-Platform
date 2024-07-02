const { getUser } = require("../service/auth");

async function checkForAuthentication(req, res, next) {
  const authHeader = req.headers["authorization"];

  const tokenCookie = authHeader.split(" ")[1]; 

  if (!tokenCookie) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await getUser(tokenCookie); 
    
  

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { checkForAuthentication };
