/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: '8px',
  			md: '6px',
  			sm: '4px'
  		},
  		colors: {
  			background: '#ffffff',
  			foreground: '#000000',
  			card: {
  				DEFAULT: '#ffffff',
  				foreground: '#000000'
  			},
  			primary: {
  				DEFAULT: '#000000',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#f3f4f6',
  				foreground: '#000000'
  			},
  			border: '#e5e7eb',
  			input: '#e5e7eb',
  			ring: '#000000',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
  safelist: [
    'bg-green-500', 'bg-green-50', 'bg-green-100', 'text-green-600', 'text-green-700', 'border-green-200',
    'bg-amber-500', 'bg-amber-50', 'bg-amber-100', 'text-amber-600', 'text-amber-700', 'border-amber-200',
    'bg-red-500', 'bg-red-50', 'bg-red-100', 'text-red-600', 'text-red-700', 'border-red-200',
    'bg-blue-500', 'bg-blue-50', 'bg-blue-100', 'text-blue-600', 'text-blue-700', 'border-blue-200',
    'bg-purple-500', 'bg-purple-50', 'bg-purple-100', 'text-purple-600', 'text-purple-700', 'border-purple-200',
  ],
}