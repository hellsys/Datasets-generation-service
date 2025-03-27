export default {
  content: ['./index.html', // Главная страница
    './src/**/*.{vue,js,ts,jsx,tsx}', // Все файлы в папке src
    './components/**/*.{vue,js}',
    './views/**/*.{vue, js}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mythemedark: {      
          "primary": "#702233",
          "secondary": "#940740",                    
          "accent": "#C20840",                    
          "neutral": "#4E4E50",                    
          "base-100": "#1B1A1D",                   
          "info": "#be185d",                    
          "success": "#059669",                   
          "warning": "#ea580c",                   
          "error": "#991b1b",
        },
      },
      {
        mythemelight: {      
          "primary": "#702233",
          "secondary": "#940740",                    
          "accent": "#C20840",                    
          "neutral": "#4E4E50",                    
          "base-100": "#e7e5e4",                   
          "info": "#be185d",                    
          "success": "#059669",                   
          "warning": "#ea580c",                   
          "error": "#991b1b",
        },
      },
    ],
  },
}

