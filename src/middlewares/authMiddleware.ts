import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

interface IDataToken {
	id: string;
	role: "usuario" | "administrador" | "superadministrador";
	iat: number;
	exp: number;
}

interface RequestWithUser extends Request {
	user?: IDataToken; // Definido basado en tu objeto de usuario
}

function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as IDataToken;

		if (!decoded.id || !decoded.role) {
			return res.status(401).json({ message: "Token Invalid" });
		}

		req.user = decoded;
		next();
	} catch (err) {
		return res.status(403).json({ message: "Token is not valid" });
	}
}

function checkRole(allowedRoles: string[]) {
	return (req: RequestWithUser, res: Response, next: NextFunction) => {
		const user = req.user;
		console.log(user);
		if (user && allowedRoles.includes(user.role)) {
			next(); // El usuario tiene un rol permitido, continúa con el siguiente middleware
		} else {
			res.status(403).json({ message: "Acceso denegado" }); // Rol no permitido
		}
	};
}

export { authenticateToken, checkRole };
