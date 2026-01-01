import jwt from "jsonwebtoken"

function auth(req, res, next) {

   const token = req.cookies.token;

   if (!token) {
      return res.status(401).send(`
  <h1>Access denied</h1>
  <h3>Please login first</h3>
  <a href="/login" style="
    display:inline-block;
    padding:10px 14px;
    background:#333;
    color:white;
    border-radius:6px;
  ">Login</a>
`);

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