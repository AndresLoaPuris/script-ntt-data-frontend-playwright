@login
Feature: Inicio de sesión
  Como cliente de Sauce Demo
  Quiero iniciar sesión con mis credenciales
  Para acceder al catálogo de productos

  Background:
    Given el cliente está en la página de inicio de sesión

  @smoke
  Scenario Outline: <id> - Iniciar sesión con credenciales válidas
    Given el caso de prueba "<id>"
    When inicia sesión con sus credenciales
    Then ve el catálogo de productos

    Examples:
      | id        |
      | TC-LOG-01 |

  @negativo
  Scenario Outline: <id> - Un usuario bloqueado no puede iniciar sesión
    Given el caso de prueba "<id>"
    When inicia sesión con sus credenciales
    Then ve el mensaje de error de inicio de sesión
    And permanece en la página de inicio de sesión

    Examples:
      | id        |
      | TC-LOG-02 |

  @negativo
  Scenario Outline: <id> - No se puede iniciar sesión con credenciales inválidas
    Given el caso de prueba "<id>"
    When inicia sesión con sus credenciales
    Then ve el mensaje de error de inicio de sesión
    And permanece en la página de inicio de sesión

    Examples:
      | id        |
      | TC-LOG-03 |
      | TC-LOG-04 |
      | TC-LOG-05 |
      | TC-LOG-06 |
