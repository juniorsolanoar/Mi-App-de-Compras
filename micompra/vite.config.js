import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),

		VitePWA({
			registerType: "autoUpdate",

			manifest: {
				name: "MiCompra",
				short_name: "MiCompra",

				description: "Organiza tus compras, presupuestos y gastos.",

				lang: "es-CR",

				theme_color: "#0d1117",
				background_color: "#0d1117",

				display: "standalone",

				orientation: "portrait-primary",

				start_url: "/",
				scope: "/",

				icons: [
					{
						src: "/pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
