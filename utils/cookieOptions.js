const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
    maxAge: process.env.REFRESH_TOKEN_TTL_DAYS,
}

module.exports = { refreshCookieOptions }