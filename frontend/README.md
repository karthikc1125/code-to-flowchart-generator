Frontend

React app to enter code, auto-detect language, and render Mermaid diagrams returned by the ast-to-mermaid service.

Run

```
cd frontend
npm install
npm start
```

Behavior

- The editor updates its language mode based on detection.
- Detected language is displayed automatically (no dropdown).
- Conversion sends language: 'auto' and the backend detects and maps.

Config

- API base and endpoints are defined in `src/services/api.ts`.


