# NITROVIA

Juego de carreras urbanas arcade en 3D: ciudad abierta con distritos (financiero, residencial,
puerto, aeropuerto, parque, montaña, playa), selección de vehículos y piloto, conducción con
drift/nitro/saltos, tráfico e IA rival, y progresión (dinero/XP/nivel) persistida localmente.

## Run & Operate

- `pnpm --filter @workspace/nitrovia run dev` — corre el juego (artifact `artifacts/nitrovia`, workflow `artifacts/nitrovia: web`)
- `pnpm --filter @workspace/api-server run dev` — API server (aún sin rutas de juego, scaffold por defecto)
- `pnpm run typecheck` — typecheck completo del monorepo
- `pnpm run build` — typecheck + build de todos los paquetes

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Juego: React + Vite + `@react-three/fiber` / `@react-three/drei` (Three.js) + `zustand` (estado + persistencia en localStorage)
- UI/HUD: Tailwind + `lucide-react`
- API/DB: scaffold por defecto sin usar todavía (v1 del juego es 100% client-side)

## Where things live

- `artifacts/nitrovia/src/game/` — todo el juego:
  - `data/` catálogos de vehículos y personajes
  - `state/` store de zustand (progresión, pantalla activa, clima) y mapeo de controles
  - `world/` ciudad (zonas, colisionadores, semáforos, entorno día/noche/lluvia), circuito de carrera
  - `vehicles/` modelo de auto y controlador del jugador (física arcade + cámara persecutoria)
  - `ai/` tráfico, rivales de carrera, peatones, policía
  - `systems/` `RaceDirector` (vueltas, posición, resultados)
  - `hud/` HUD en pantalla
  - `screens/` menú, garaje, selección de piloto, selección de modo, resultados
  - `GameRoot.tsx` enruta entre pantallas según el store; `GameScene.tsx` monta el Canvas 3D

## Architecture decisions

- v1 es enteramente client-side: progresión (dinero/XP/nivel/vehículos) se guarda en `localStorage` vía `zustand/persist`. No hay backend/DB para el juego todavía.
- Colisiones usan círculos (no cajas completas) contra una lista de colisionadores estáticos registrada una vez al montar la ciudad — suficiente para un arcade, no una simulación física completa.
- El circuito de carrera es un recorrido fijo de waypoints por el centro financiero/residencial, elegido para quedar siempre libre de los edificios de las zonas exteriores.
- El personaje seleccionado es solo cosmético (no se renderiza en pista, la cámara sigue al auto); queda preparado para futuras vistas en tercera persona.

## Product

- Menú principal → selección de modo (carrera de 3 vueltas contra rivales, o exploración libre) → juego.
- Garaje con 8 categorías de vehículos (compacto, muscle, SUV, pickup, deportivo, superdeportivo, clásico, eléctrico), cada una con stats distintos; se compran con dinero ganado en carreras y se desbloquean por nivel.
- Selección de piloto (6 personajes, estilo cosmético).
- Ciclo día/noche automático, clima (lluvia) activable desde el HUD, tráfico y peatones ambientales, policía simple en modo libre.

## User preferences

- El usuario pidió avanzar "paso a paso y completamente funcional" sin detenerse a pedir permiso en cada paso.
- Alcance acordado: se advirtió que el alcance comercial completo (mapa enorme, monetización real, exportación multi-plataforma) no es viable en una sola pasada; se construyó una v1 sólida y jugable para iterar después.

## Gotchas

- El `Screenshot` (appPreview) no puede renderizar el canvas 3D (WebGL deshabilitado en el sandbox de captura) — no es un bug de la app. Verificar con `tsc --noEmit`, logs del workflow, y capturas de pantallas no-3D (menús/HUD).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `gamestack-js` skill for conventions on physics, controls, and instancing used across `src/game/`
