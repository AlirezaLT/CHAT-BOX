import jwt from "jsonwebtoken"

function auth(req, res, next) {

   const token = req.cookies.token;

   if (!token) {
      res.redirect('/login?error=pleaseLoginFirst')
      res.redirect('/login');
}

   try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
   } catch (error) {
      console.log("Token error:", error);
      return res.status(401).send('Invalid token');
   }

}
export default auth