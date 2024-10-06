import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RegistroModal = ({ show, handleClose, handleRegister }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false); // Estado de carga

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); // Resetear el error

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		setIsLoading(true); // Comenzar el estado de carga
		const result = await handleRegister(email, password);
		setIsLoading(false); // Terminar el estado de carga

		if (result.error) {
			setError(result.error);
		} else {
			handleClose(); // Cerrar modal si el registro fue exitoso
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Registro</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="formEmail">
						<Form.Label>Correo Electrónico</Form.Label>
						<Form.Control
							type="email"
							placeholder="Ingresa tu correo"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group controlId="formPassword">
						<Form.Label>Contraseña</Form.Label>
						<Form.Control
							type="password"
							placeholder="Ingresa tu contraseña"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group controlId="formConfirmPassword">
						<Form.Label>Confirmar Contraseña</Form.Label>
						<Form.Control
							type="password"
							placeholder="Confirma tu contraseña"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</Form.Group>
					{error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}
					<Button variant="primary" type="submit" disabled={isLoading}>
						{isLoading ? "Registrando..." : "Registrarse"}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default RegistroModal;
