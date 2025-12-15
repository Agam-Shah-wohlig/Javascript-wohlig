const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // for signup
const User = require("../models/user");
const Session = require("../models/session");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
const authenticateUser = require("../utils/userAuthentication");
const { access } = require("fs");

function hash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}



function HandleDisplayLogin(req, res) {
    try {
        return res.render("login", { message: null});
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

async function HandleJwtLogin(req, res) {
    try {
        const user = await authenticateUser(req.body.email, req.body.password);

        const session = await Session.create({
            userId: user._id,
            refreshTokenHash: crypto.randomBytes(64).toString("hex"),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const accessToken = signAccessToken(user);
        console.log("Inside Auth Controller",accessToken);
        const refreshToken = signRefreshToken(user._id, session._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        });

        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        } else {
            return res.redirect("/user/dashboard");
        }

    } catch (err) {
        console.log(err.message);
        return res.status(401).render("login", { message: err.message });
    }
}

/// Refresh token rotation
async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_PUBLIC_KEY);
  } catch {
    return res.sendStatus(401);
  }

  const session = await Session.findById(payload.jti);
  if (!session || session.revoked) return res.sendStatus(401);

  session.revoked = true;
  await session.save();

  // create new session
  const newSession = await Session.create({
    userId: payload.sub,
    refreshTokenHash: "", // will set after JWT
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  const newRefreshToken = signRefreshToken(payload.sub, newSession._id);
  newSession.refreshTokenHash = hash(newRefreshToken);
  await newSession.save();

  // get user data for access token
  const user = await User.findById(payload.sub);
  const newAccessToken = signAccessToken(user);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });

  res.json({ accessToken: newAccessToken });
};

function HandleDisplaySignup(req, res) {
    try {
        return res.render("signup", { message: null });
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

async function HandleSignup(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).render("signup", { message: "All fields are required" });
        }

        const email_regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
        if (!email_regex.test(email)) {
            return res.status(400).render("signup", { message: "Email must end with @gmail.com, @yahoo.com, or @hotmail.com." });
        }

        const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if(!password_regex.test(password)) {
            return res.status(400).render("signup", { message: "Password must have uppercase, lowercase, number, symbol, and be 8+ characters."})
        }

        if (password !== confirmPassword) {
            return res.status(400).render("signup", { message: "Passwords do not match" });
        }

       const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("signup", { message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        
        return res.status(200).redirect("login");

    } catch (err) {
        console.error(err);
        return res.status(500).render("signup", { message: "Server Error" });
    }
}

function HandleDisplayUserDashboard(req, res) {
    try {
        return res.render("user-dashboard", { message: null});
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}


module.exports = {
    HandleDisplayLogin,
    HandleDisplaySignup,
    HandleJwtLogin,
    HandleSignup,
    HandleDisplayUserDashboard,
    refresh
}