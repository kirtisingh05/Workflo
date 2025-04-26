import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res
				.status(401)
				.json({ message: "Access denied. No token found." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user_id = decoded.id;

		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
