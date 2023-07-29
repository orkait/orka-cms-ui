/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";
import tailwindTypography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";
import theme from "daisyui/src/theming/themes";

const childrenSupport = ({ addVariant }) => {
	addVariant("child", "& > *");
	addVariant("child-hover", "& > *:hover");
};

const extendedTailwind = plugin(function ({ addComponents }) {
	addComponents({
		".axis-center": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		".test": {
			border: "1px solid black !important",
		},
	});
});

const tail = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				"fade-in": {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-in-out",
			},
		},
		screen: {
			sm: 425,
			md: 768,
			lg: 1024,
			xl: 1280,
			"2xl": 1440,
		},
		fontFamily: {
			satoshi: "Satoshi sans-serif",
		},
	},

	daisyui: {
		styled: true,
		themes: [
			{
				light: theme["[data-theme=light]"],
			},
			{
				dark: theme["[data-theme=night]"],
			},
		],

		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: "",
	},

	plugins: [tailwindTypography, extendedTailwind, daisyui, childrenSupport],
};


export default tail;