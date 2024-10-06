import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// No cambies esto, aquí es donde inicializamos nuestro contexto, por defecto será nulo.
export const Context = React.createContext(null);

// Esta función inyecta el store global en cualquier vista/componente donde quieras usarlo.
const injectContext = (PassedComponent) => {
	const StoreWrapper = (props) => {
		// Este será pasado como el valor del contexto
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: (updatedStore) =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions },
					}),
			})
		);

		useEffect(() => {
			// Esta función se ejecuta una vez en toda la vida de la aplicación
			if (state.actions.getMessage) {
				state.actions.getMessage(); // Llamando a esta función desde flux.js
			}
		}, [state.actions]); // Dependencia para asegurar que actions están disponibles

		// Nueva acción para iniciar sesión
		const login = async (email, password) => {
			const response = await fetch(`https://musical-train-4jj54jqx56943j9qx-3001.app.github.dev/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const data = await response.json();
				// Almacena el token en localStorage o maneja el estado del usuario
				localStorage.setItem("token", data.token);
				// Actualiza el estado global para reflejar el usuario autenticado
				setState((prevState) => ({
					...prevState,
					store: {
						...prevState.store,
						isAuthenticated: true, // Cambia el estado de autenticación
						user: data.user, // Puedes guardar los detalles del usuario
					},
				}));
				return data;
			} else {
				return { error: "Credenciales inválidas" }; // Maneja el error
			}
		};

		// Agrega la nueva acción al contexto
		const actions = {
			...state.actions,
			login,
		};

		return (
			<Context.Provider value={{ store: state.store, actions }}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
