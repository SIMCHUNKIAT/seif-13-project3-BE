import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }

  // // - (Optional) check for token expiry
  // // decode jwt, extract user_id, set it in a globally available var in express
  // const decoded = jwt.decode(token)
  //   if (!decoded) {
  //       res.statusCode = 401
  //       return res.json({
  //           msg: "failed to decode token"
  //       })
  //   }

  //   // set decoded "sub" field (refers to who the token belongs to) to res.locals
  //   res.locals.authUserID = decoded.sub
  //   next()
};
