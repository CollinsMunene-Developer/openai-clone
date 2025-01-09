// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./app/**/*.{html,js,ts,jsx,tsx}"], // Added paths to include your project's files
    theme: {
    	extend: {
        	colors: {
        		border: 'hsl(var(--border))', // Added 'border' key for border-border class
            background: 'hsl(var(--background))', // Added background color mapping
            foreground: 'hsl(var(--foreground))', // Added foreground color mapping
        		sidebar: {
        			DEFAULT: 'hsl(var(--sidebar-background))',
        			foreground: 'hsl(var(--sidebar-foreground))',
        			primary: 'hsl(var(--sidebar-primary))',
        			'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        			accent: 'hsl(var(--sidebar-accent))',
        			'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        			border: 'hsl(var(--sidebar-border))',
        			ring: 'hsl(var(--sidebar-ring))'
        		}
        	}
        }
    },
    plugins: [],
}