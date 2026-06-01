const express = require("express");
const passport = require("passport");
const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorised. Please log in." });
};

router.get("/linkedin", passport.authenticate("linkedin", { state: true }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  },
);

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = { router, isAuthenticated };
