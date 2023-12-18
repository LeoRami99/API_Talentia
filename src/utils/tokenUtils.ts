import jwt from "jsonwebtoken";

function generateToken(email: string, is_active: boolean) {
	if (is_active === false) {
		return jwt.sign({ email }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" });
	} else {
		return {
			valid: true,
			message: "User is active",
		};
	}
}
function verifyToken(token: string) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;

		// Asumiendo que siempre hay un email en el payload del JWT
		return {
			isValid: true,
			email: decoded.email,
			message: "Token is valid",
		};
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return { isValid: false, message: "El token ha expirado." };
		} else if (error instanceof jwt.JsonWebTokenError) {
			return { isValid: false, message: "Token inválido." };
		} else {
			return { isValid: false, message: "Error al verificar el token." };
		}
	}
}

function generateTokenResetPassword(id: string) {
	return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" });
}
function verifyTokenResetPassword(token: string) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;
		return {
			isValid: true,
			id: decoded.id,
			message: "Token is valid",
		};
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return { isValid: false, message: "El token ha expirado." };
		} else if (error instanceof jwt.JsonWebTokenError) {
			return { isValid: false, message: "Token inválido." };
		} else {
			return { isValid: false, message: "Error al verificar el token." };
		}
	}
}

export { generateToken, verifyToken, generateTokenResetPassword, verifyTokenResetPassword };
