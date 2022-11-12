class User {
    constructor(
        userId,
        nama,
        cookies,
        createdAt,
        loginAt,
        isLogin,
    ) {
        this.userId = userId;
        this.nama = nama;
        this.cookies = cookies;
        this.createdAt = createdAt;
        this.loginAt = loginAt;
        this.isLogin = isLogin;
    }
}

module.exports = User;