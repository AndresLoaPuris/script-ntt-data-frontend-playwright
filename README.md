# Sauce Demo · Pruebas E2E con Playwright y Cucumber

[![E2E tests](https://github.com/AndresLoaPuris/script-ntt-data-frontend-playwright/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/AndresLoaPuris/script-ntt-data-frontend-playwright/actions/workflows/e2e-tests.yml)

Suite de pruebas end-to-end para [Sauce Demo](https://www.saucedemo.com/), construida con **Playwright**, **Cucumber** y **TypeScript** siguiendo el patrón **Page Object Model**. Cubre el inicio de sesión con distintos tipos de usuario, el carrito de compras y el proceso de compra hasta la confirmación.

Los escenarios están escritos en Gherkin con `Scenario Outline`, y los datos de cada caso se toman de una **matriz de Excel** a partir de su ID.

La estrategia de automatización y los patrones aplicados están explicados en [docs/ESTRATEGIA.md](docs/ESTRATEGIA.md).

## Stack

| Herramienta | Versión |
|---|---|
| Node.js | 24 |
| TypeScript | 7.0 (ejecutado de forma nativa por Node) |
| Cucumber (`@cucumber/cucumber`) | 13.3 |
| Playwright (`@playwright/test`) | 1.65 |
| ExcelJS (lectura de Excel) | 4.4 |
| Multiple Cucumber HTML Reporter | 4.6 |

## Requisitos

- **Node.js 24 o superior.** Node 24 ejecuta TypeScript directamente, sin compilar ni usar loaders.

Para comprobar la versión:

```bash
node --version
```

## Instalación

Clonar el repositorio y, desde la raíz del proyecto:

```bash
npm install
npx playwright install chromium
```

## Ejecución

```bash
npm test
```

Por defecto las pruebas corren en Chromium, sin interfaz gráfica y con dos escenarios en paralelo.

### Opciones

| Variable | Valores | Por defecto |
|---|---|---|
| `BROWSER` | `chromium`, `firefox`, `webkit` | `chromium` |
| `HEADLESS` | `true`, `false` | `true` |

```bash
# Linux / macOS
HEADLESS=false npm test
BROWSER=firefox npm test

# Windows (PowerShell)
$env:HEADLESS="false"; npm test
$env:BROWSER="firefox"; npm test
```

Para Firefox o WebKit hay que instalar antes el navegador: `npx playwright install firefox`.

### Ejecución por tags

```bash
npm test -- --tags @smoke
npm test -- --tags @negativo
npm test -- --tags "@login or @compra"
```

| Tag | Qué ejecuta |
|---|---|
| `@smoke` | El camino feliz de cada funcionalidad |
| `@negativo` | Credenciales inválidas, usuario bloqueado y datos de envío incompletos |
| `@login` `@carrito` `@compra` | Una funcionalidad en particular |

### Verificación de tipos

```bash
npm run typecheck
```

### Reportes

Después de ejecutar las pruebas, genera el reporte HTML con:

```bash
npm run report
```

Se crea en `reports/html/index.html` y se abre directamente en el navegador. Está en español e incluye:
- un panel con gráficos del estado de funcionalidades, escenarios y pasos,
- los datos de la ejecución: navegador y versión, modo headless, sistema operativo, versión de Node, entorno y duración,
- el detalle de cada escenario con su ID y sus pasos; si falló, también el error esperado contra el recibido,
- una **captura de pantalla de página completa después de cada paso**, en todos los escenarios (salvo los pasos que se ejecutan antes de abrir el sitio, como la carga del caso de prueba),
- los escenarios y pasos más lentos.

Para ver una captura, entra a una funcionalidad, expande un escenario y, debajo de cada paso, abre el adjunto con el nombre de ese paso. Las imágenes se guardan como archivos aparte dentro de `reports/html`, así las páginas del reporte cargan rápido aunque haya muchas capturas.

`npm run report` es un comando aparte para que el reporte se pueda generar aunque haya pruebas fallidas, que es justo cuando más se necesita. Usa el navegador indicado en `BROWSER`, así que conviene ejecutarlo con la misma configuración que las pruebas.

## Escenarios

| Feature | Escenarios | Positivos | Negativos |
|---|---|---|---|
| `login.feature` | 6 | 1 | 5 |
| `carrito.feature` | 4 | 4 | 0 |
| `compra.feature` | 6 | 3 | 3 |
| **Total** | **16** | **8** | **8** |

| Criterio de aceptación | Casos |
|---|---|
| Iniciar sesión con credenciales válidas | `CP-LOGIN-01` |
| No iniciar sesión con credenciales inválidas | `CP-LOGIN-03` a `CP-LOGIN-06` |
| Usuario bloqueado (`locked_out_user`) | `CP-LOGIN-02` |
| Agregar productos desde la página de productos | `CP-CARRITO-01`, `CP-CARRITO-02` |
| Ver los productos agregados en el carrito | `CP-CARRITO-03`, `CP-CARRITO-04` |
| Completar la compra hasta la confirmación | `CP-COMPRA-01` a `CP-COMPRA-03` |
| Validación de los datos de envío | `CP-COMPRA-04` a `CP-COMPRA-06` |

## Datos de prueba

Los datos están en [`src/data/saucedemo.xlsx`](src/data/saucedemo.xlsx). Cada feature lista los IDs de sus casos en los `Examples` y el primer paso, `Given el caso de prueba "<id>"`, carga la fila correspondiente:

```gherkin
Scenario Outline: <id> - Completar la compra hasta la confirmación
  Given el caso de prueba "<id>"
  And el cliente inició sesión
  And agrega los productos al carrito
  When completa la compra con sus datos de envío
  Then ve la confirmación del pedido

  Examples:
    | id           |
    | CP-COMPRA-01 |
    | CP-COMPRA-02 |
```

| Hoja | Contenido |
|---|---|
| `usuarios` | Credenciales de `standard_user` y `locked_out_user` |
| `login` | Usuario, contraseña y mensaje de error esperado (`CP-LOGIN-xx`) |
| `carrito` | Productos a agregar y a quitar (`CP-CARRITO-xx`) |
| `compra` | Productos, datos de envío y mensaje esperado (`CP-COMPRA-xx`) |

Reglas de la matriz:
- El prefijo del ID indica la hoja: `CP-LOGIN` → `login`, `CP-CARRITO` → `carrito`, `CP-COMPRA` → `compra`.
- Una celda vacía deja el campo vacío en el formulario.
- Varios productos se separan con `;`.

### Agregar un caso nuevo

1. Agregar una fila en la hoja correspondiente del Excel, con un ID nuevo.
2. Agregar ese ID en los `Examples` del escenario que corresponda en el feature.
3. Ejecutar `npm test`.

## Estructura del proyecto

```
script-ntt data-frontend-playwright/
├── package.json · tsconfig.json · cucumber.js
├── docs/ESTRATEGIA.md
├── .github/workflows/e2e-tests.yml
├── scripts/generate-report.ts       Genera el reporte HTML a partir del JSON de Cucumber
└── src/
    ├── features/                    Escenarios en Gherkin
    │   ├── login.feature
    │   ├── carrito.feature
    │   └── compra.feature
    ├── steps/                       Step definitions
    │   ├── common.steps.ts
    │   ├── login.steps.ts
    │   ├── carrito.steps.ts
    │   └── compra.steps.ts
    ├── pages/                       Page Object Model
    │   ├── SauceDemoPages.ts        Punto de acceso a todas las páginas
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   ├── CheckoutInformationPage.ts
    │   ├── CheckoutOverviewPage.ts
    │   ├── CheckoutCompletePage.ts
    │   └── components/HeaderComponent.ts
    ├── data/
    │   ├── saucedemo.xlsx           Matriz de datos de prueba
    │   ├── TestDataRepository.ts    Busca un caso por su ID
    │   └── TestCase.ts              Acceso a los valores de un caso
    └── support/
        ├── world.ts                 Estado de cada escenario
        ├── hooks.ts                 Ciclo de vida del navegador y capturas
        ├── config.ts                URL, navegador, headless y timeouts
        └── product.ts               Modelo de producto y lectura de precios
```

## Integración continua

El workflow [e2e-tests.yml](.github/workflows/e2e-tests.yml) se ejecuta en cada push y pull request a `main`: instala dependencias y Chromium, verifica los tipos, corre la suite, genera el reporte HTML aunque haya fallos y publica los reportes como artefacto descargable (`reportes-e2e`).
