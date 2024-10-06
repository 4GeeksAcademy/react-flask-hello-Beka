// Componente de Inicio de Sesión (Login.js)
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"; // Cambiar a useNavigate
import RegistroModal from "../component/registromodal"; // Importa el modal
import { Button } from 'react-bootstrap'; // Asegúrate de importar Button

const Login = () => {
	const { actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
	const navigate = useNavigate(); // Hook para manejar la navegación

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); // Resetear el error
	
		try {
			const result = await actions.login(email, password);
			if (result.error) {
				setError(result.error);
			} else {
				localStorage.setItem('token', result.token);
				console.log("Inicio de sesión exitoso:", result.user);
				navigate('/');
			}
		} catch (err) {
			setError("Error de conexión. Por favor, intenta de nuevo.");
			console.error("Error al iniciar sesión:", err);
		}
	};
	

	const handleRegister = async (email, password) => {
		// Aquí puedes implementar la lógica de registro.
		// Por ejemplo, llamar a una función de actions para registrar al usuario.
		const result = await actions.register(email, password);
		if (result.error) {
			setError(result.error); // Manejo de errores
		} else {
			setShowModal(false); // Cerrar el modal si el registro fue exitoso
			console.log("Registro exitoso:", result.user); // Mostrar usuario registrado
		}
	};

	return (
		<div>
			<h2>Iniciar Sesión</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Correo Electrónico:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Contraseña:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}
				<button type="submit">Iniciar Sesión</button>
			</form>
			<p>
				¿No tienes una cuenta? <Button variant="link" onClick={() => setShowModal(true)}>Regístrate aquí</Button>
			</p>

			{/* Modal de Registro */}
			<RegistroModal 
				show={showModal} 
				handleClose={() => setShowModal(false)} 
				handleRegister={handleRegister} 
			/>
		</div>
	);
};

export default Login;
