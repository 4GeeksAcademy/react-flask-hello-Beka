

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Acción de registro
			register: async (email, password) => {
				// Validar que el correo electrónico y la contraseña no estén vacíos
				if (!email || !password) {
					return { error: "El correo electrónico y la contraseña son obligatorios." };
				}

				const url = `https://musical-train-4jj54jqx56943j9qx-3001.app.github.dev/register`;

				try {
					const response = await fetch(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});

					// Manejo de la respuesta
					if (!response.ok) {
						const errorData = await response.json(); // Obtener datos de error
						const errorMessage = errorData.message || "Error en el registro";
						throw new Error(errorMessage);
					}

					const data = await response.json(); // Obtener los datos del usuario

					// Actualizar el estado global si es necesario
					setStore({ message: "Registro exitoso" });

					return data; // Devuelve los datos del usuario o token
				} catch (error) {
					console.error("Error en el registro:", error.message);
					return { error: error.message }; // Manejo de errores
				}
			},

			// Otras acciones pueden ir aquí
		}
	};
};

export default getState;
