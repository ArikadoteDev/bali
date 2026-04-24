# Bali Squad Website

A Vite + React + Tailwind website for the Bali Squad trip.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Upload all files in this folder to a GitHub repository.
2. Go to Vercel and import the GitHub repository.
3. Use these settings:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
4. Click Deploy.

## Notes

- The weather uses Open-Meteo and does not need an API key.
- The editable budget saves in the visitor's browser using localStorage.
