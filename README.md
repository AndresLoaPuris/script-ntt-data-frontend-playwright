# Sauce Demo · Pruebas E2E con Playwright y Cucumber

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

### Reporte

Al terminar, Cucumber genera un reporte HTML:

```
reports/cucumber-report.html
```

Si un escenario falla, el reporte incluye una captura de pantalla de la página en ese momento.

## Escenarios

| Feature | Escenarios | Positivos | Negativos |
|---|---|---|---|
| `login.feature` | 6 | 1 | 5 |
| `carrito.feature` | 4 | 4 | 0 |
| `compra.feature` | 6 | 3 | 3 |
| **Total** | **16** | **8** | **8** |

| Criterio de aceptación | Casos |
|---|---|
| Iniciar sesión con credenciales válidas | `TC-LOG-01` |
| No iniciar sesión con credenciales inválidas | `TC-LOG-03` a `TC-LOG-06` |
| Usuario bloqueado (`locked_out_user`) | `TC-LOG-02` |
| Agregar productos desde la página de productos | `TC-CAR-01`, `TC-CAR-02` |
| Ver los productos agregados en el carrito | `TC-CAR-03`, `TC-CAR-04` |
| Completar la compra hasta la confirmación | `TC-COM-01` a `TC-COM-03` |
| Validación de los datos de envío | `TC-COM-04` a `TC-COM-06` |

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
    | id        |
    | TC-COM-01 |
    | TC-COM-02 |
```

| Hoja | Contenido |
|---|---|
| `usuarios` | Credenciales de `standard_user` y `locked_out_user` |
| `login` | Usuario, contraseña y mensaje de error esperado (`TC-LOG-xx`) |
| `carrito` | Productos a agregar y a quitar (`TC-CAR-xx`) |
| `compra` | Productos, datos de envío y mensaje esperado (`TC-COM-xx`) |

Reglas de la matriz:
- El prefijo del ID indica la hoja: `TC-LOG` → `login`, `TC-CAR` → `carrito`, `TC-COM` → `compra`.
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

El workflow [e2e-tests.yml](.github/workflows/e2e-tests.yml) se ejecuta en cada push y pull request a `main`: instala dependencias y Chromium, verifica los tipos, corre la suite y publica el reporte de Cucumber como artefacto descargable.
