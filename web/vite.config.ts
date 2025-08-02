import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 3000,
		proxy: {
			"/graphql": {
				target: "http://3.26.213.105:4000",
				changeOrigin: true,
				secure: false,
			},
			"/health": {
				target: "http://3.26.213.105:4001",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
