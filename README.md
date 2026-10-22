# Automatización QA de DemoBlaze

Este proyecto automatiza pruebas funcionales de la tienda de demostración [DemoBlaze](https://www.demoblaze.com/). Su objetivo es comprobar, desde la perspectiva de una persona usuaria, que las funciones principales de compra y contacto responden correctamente.

> Este repositorio contiene pruebas y herramientas de automatización; no contiene el código fuente de la tienda. Las pruebas interactúan con el sitio público, por lo que dependen de su disponibilidad y de los datos que mantenga el servicio.

## Qué se valida

| Prueba | Qué hace | Qué comprueba |
| --- | --- | --- |
| `tests/carrito.spec.ts` | Abre la tienda, filtra laptops, selecciona **MacBook air**, lo agrega al carrito y abre este último. | Que la categoría cargue (respuesta HTTP 200), que se muestre el producto, que la tienda confirme `Product added` y que el carrito liste el producto por 700. |
| `tests/checkout.spec.ts` | Recorre la compra de **MacBook air**, completa el formulario de pedido con valores de prueba y envía la compra. | Que el total sea 700, que el formulario muestre los campos esperados y que aparezca `Thank you for your purchase!` con `Amount: 700 USD` y el nombre de prueba. |
| `tests/contact.spec.ts` | Abre **Contact**, completa el correo, nombre y mensaje de prueba, y envía el formulario. | Que la tienda muestre la confirmación `Thanks for the message!!`. La prueba acepta la alerta para que el navegador pueda continuar. |

Los datos usados en checkout y Contact son datos ficticios de prueba. DemoBlaze es un sitio de demostración; estas pruebas no representan una integración con un procesador de pagos real.

## Cómo está organizado

```text
AgentQ/
├── README.md                 # Esta guía
├── tests/
│   ├── carrito.spec.ts        # Agregar y verificar un producto
│   ├── checkout.spec.ts       # Flujo completo de compra
│   ├── contact.spec.ts        # Envío de mensaje
│   ├── seed.spec.ts           # Semilla: abre la página de DemoBlaze
│   └── pages/                 # Page Objects: interacción con cada página
│       ├── HomePage.ts
│       ├── ProductPage.ts
│       ├── CartPage.ts
│       ├── ContactPage.ts
│       └── login.page.ts      # Objeto de login todavía no usado por una prueba
├── specs/
│   ├── README.md              # Descripción de la carpeta de planes
│   ├── carrito.md             # Plan del flujo de carrito
│   └── checkout.md            # Plan del flujo de checkout
├── .github/                   # Instrucciones, agentes y workflows de CI
├── .vscode/mcp.json           # Configuración del servidor MCP de Playwright
├── playwright.config.ts      # Navegadores, ejecución y evidencias
├── package.json              # Dependencias y comandos npm
└── package-lock.json         # Versiones exactas de dependencias npm
```

```text
Prueba (*.spec.ts)
      │ usa
      ▼
Page Objects (tests/pages/)
      │ localizan e interactúan con
      ▼
DemoBlaze (www.demoblaze.com)
      │
      ├── Aserciones: contenido, filas, importes y confirmaciones
      └── Evidencias: logs, trazas, capturas y vídeos ante fallos
```

## Diseño de las pruebas: Page Object Model

Las pruebas separan **el escenario** (los pasos y sus resultados esperados) de **la interacción con la interfaz** (los localizadores y acciones).

- **`HomePage`** abre la tienda, selecciona categorías y permite abrir productos.
- **`ProductPage`** identifica el encabezado del producto y lo agrega al carrito.
- **`CartPage`** abre el carrito, localiza las filas, lee el total y completa el formulario de compra.
- **`ContactPage`** abre el formulario, completa los campos y captura y acepta la alerta de confirmación.

Los localizadores se basan principalmente en roles y nombres visibles (`getByRole`, `getByText`). Las expectativas usan aserciones explícitas de Playwright, como `toBeVisible`, `toContainText` y `toHaveText`. Para evitar carreras con la carga asíncrona de la tienda, los Page Objects esperan las respuestas de categoría y carrito antes de que la prueba compruebe su contenido.

## Herramientas y configuración

- **Playwright Test 1.64.1** ejecuta las pruebas, controla el navegador y ofrece aserciones, trazas e informes.
- **TypeScript** se utiliza para las pruebas y Page Objects.
- **Google Chrome** es el destino de los comandos npm del proyecto. La configuración incluye también los proyectos `chromium`, `firefox` y `webkit`.
- **npm** instala y gestiona las dependencias, fijadas mediante `package-lock.json`.
- La configuración ejecuta un worker para evitar que las pruebas que comparten el carrito externo interfieran entre sí. En desarrollo, Chrome se abre con acciones ralentizadas; con `CI` definido, se ejecuta en modo headless.
- Se genera el informe HTML de Playwright. Para el proyecto Chrome se conservan trazas durante la ejecución; las capturas y vídeos se guardan en caso de fallo.
- `playwright-report/`, `test-results/` y `.playwright-mcp/` contienen resultados temporales y archivos de exploración. Se pueden regenerar al volver a ejecutar pruebas o herramientas; están excluidos del control de versiones.

La tienda puede cambiar, responder lentamente o no estar disponible. Si un test falla, revisar primero su salida y luego la traza, captura, vídeo y `browser-event-log.txt` adjuntos antes de cambiar localizadores o expectativas.

## Agentes y herramientas de apoyo

Los agentes no forman parte de la aplicación ni se ejecutan automáticamente junto con las pruebas. Se utilizaron durante la preparación y diagnóstico del trabajo:

| Agente o herramienta | Función en el flujo QA |
| --- | --- |
| **Planner de Playwright** | Explora la interfaz desde `tests/seed.spec.ts`, identifica pasos y resultados observables, y produce planes como `specs/carrito.md` y `specs/checkout.md`. |
| **Generator de Playwright** | Convierte un plan aprobado en un archivo `.spec.ts`; en este proyecto se pidió reutilizar los Page Objects existentes. |
| **Healer / depuración de Playwright** | Su función prevista es reproducir un fallo, inspeccionar el navegador y sugerir una corrección. En este entorno, el agente personalizado no pudo iniciarse porque el modelo configurado no estaba disponible; el diagnóstico se hizo con la herramienta de depuración integrada de Playwright. |

El archivo `.vscode/mcp.json` configura el servidor MCP `playwright-test`, que proporciona herramientas de navegador, planificación, generación y depuración. La implementación concreta de esos agentes vive en las herramientas de Copilot/Playwright, no en este repositorio. Las instrucciones locales para contribuir a la automatización están en `.github/copilot-instructions.md`.

## Uso recomendado en Scrum

La automatización puede acompañar el trabajo del equipo durante el sprint:

1. **Refinamiento:** acordar criterios de aceptación claros para un flujo, por ejemplo, que el producto seleccionado aparezca en el carrito con el total esperado.
2. **Implementación:** crear o actualizar el plan de prueba y mantener los localizadores e interacciones dentro de los Page Objects.
3. **Verificación:** ejecutar `npm test` como comprobación funcional y de regresión; revisar las evidencias cuando algo falle.
4. **Definition of Done:** considerar el cambio listo cuando los criterios acordados estén cubiertos, las pruebas relevantes pasen y la documentación relacionada esté actualizada.

Este flujo es una recomendación de trabajo; el repositorio no contiene una configuración que imponga ceremonias Scrum ni una Definition of Done automática.

## Ejecutar las pruebas

Requisitos: Node.js 20 o posterior, npm y Google Chrome instalado para el proyecto `chrome`.

```powershell
npm ci
npm test
```

`npm test` ejecuta los tres escenarios en Chrome. Para abrir la interfaz de Playwright:

```powershell
npm run test:ui
```

En Playwright UI, seleccionar un test y pulsar **▶** para ejecutarlo. `tests/seed.spec.ts` es una semilla de exploración que solamente navega a la tienda; no forma parte de `npm test`.

## Integración continua

`.github/workflows/playwright.yml` instala dependencias y navegadores y ejecuta `npx playwright test` en cambios a `main` o `master` y en pull requests dirigidos a esas ramas. Al finalizar, publica `playwright-report/` como artefacto.

El comando de CI ejecuta todos los proyectos definidos en `playwright.config.ts`; los comandos locales de `npm` se enfocan en Chrome. La instalación del navegador de marca Chrome en el runner de CI debe mantenerse alineada con el proyecto `chrome` si se desea ejecutar también allí.

## Planes y pruebas implementadas

Los documentos de `specs/` describen el comportamiento esperado. La cobertura automatizada está en `tests/`. Actualmente existe un `LoginPage`, pero no un test de login ni una integración de esa página con un flujo activo.
