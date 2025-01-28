const jwt = require('jsonwebtoken');
const DB = require('./db');

async function verifyToken(req, res, next) {
	const bearerToken = req.headers['authorization'];
	if (!bearerToken) return res.sendStatus(403);
	try {
		jwt.verify(bearerToken, 'n@nhrms@123', (err, data) => {
			const { email, password = "", ID } = data || {};
			DB.GetOneDocument('users', { _id: ID }, {}, {}, async function (err, result) {
				if (result) {
					if (result.isactive) {
						const checkpassword = (password == result.password) || false;
						if (checkpassword) {
							req.ID = result._id;
							req.email = email;
							next();
						} else {
							return res.status(403).json({ status: 0, message: 'Password has been changed' });
						}
					} else {
						return res.status(403).json({ status: 0, message: 'Your account has been blocked. Please contact an admin' });
					}
				} else {
					return res.status(403).json({ status: 0, message: 'Please contact an admin' });
				}
			})
		});
	} catch (error) {
		return res.status(403).json({ status: 0, message: 'Internal server error', error: error.message });
	}
}

module.exports = verifyToken;