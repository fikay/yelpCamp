module.exports.loggedIn = ((req,res, next)=>{

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "Please sign in");
        return res.redirect("/login");
}
next();
});

module.exports.storeReturnTo=((req,res, next)=>{
     if (req.session.returnTo) {
       res.locals.returnTo = req.session.returnTo;
     }
     next();
})