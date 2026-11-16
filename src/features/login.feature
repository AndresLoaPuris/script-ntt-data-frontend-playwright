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
      | id          |
      | CP-LOGIN-01 |

  @negativo
  Scenario Outline: <id> - Un usuario bloqueado no puede iniciar sesión
    Given el caso de prueba "<id>"
    When inicia sesión con sus credenciales
    Then ve el mensaje de error de inicio de sesión
    And permanece en la página de inicio de sesión

    Examples:
      | id          |
      | CP-LOGIN-02 |

  @negativo
  Scenario Outline: <id> - No se puede iniciar sesión con credenciales inválidas
    Given el caso de prueba "<id>"
    When inicia sesión con sus credenciales
    Then ve el mensaje de error de inicio de sesión
    And permanece en la página de inicio de sesión

    Examples:
      | id          |
      | CP-LOGIN-03 |
      | CP-LOGIN-04 |
      | CP-LOGIN-05 |
      | CP-LOGIN-06 |
