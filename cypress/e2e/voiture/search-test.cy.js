describe("Stock Car App", () => {
  //get all cars test
  it("should display the list of cars on load", () => {
    cy.intercept(
      "GET",
      "http://localhost:8080/esieaBack/rest/voiture/get/all/0/3",
      {
        statusCode: 200,
        body: {
          voitures: [
            `{
            "id": 1,
            "marque": "Toyota",
            "modele": "Camry",
            "finition": "Sedan",
            "carburant": "ESSENCE",
            "km": 50000,
            "annee": 2020,
            "prix": 25000
          }`,
            `{
            "id": 2,
            "marque": "Honda",
            "modele": "Civic",
            "finition": "Hatchback",
            "carburant": "HYBRIDE",
            "km": 30000,
            "annee": 2021,
            "prix": 28000
          }`,
            `{
            "id": 3,
            "marque": "Ford",
            "modele": "Fusion",
            "finition": "Sedan",
            "carburant": "DIESEL",
            "km": 60000,
            "annee": 2019,
            "prix": 22000
          }`,
          ],
          volume: 3,
        },
        headers: { "access-control-allow-origin": "*" },
        delayMs: 500,
      }
    ).as("apiCall");

    cy.visit("http://localhost:8080/src/main/webapp/index.html");

    cy.get("#listeVoitureTable").should("exist");

    cy.wait("@apiCall");

    // Search Test
    cy.intercept(
      "GET",
      "http://localhost:8080/esieaBack/rest/voiture/get/Toyota/0/3",
      {
        statusCode: 200,
        body: {
          voitures: [
            `{
              "id": 1,
              "marque": "Toyota",
              "modele": "Camry",
              "finition": "Sedan",
              "carburant": "ESSENCE",
              "km": 50000,
              "annee": 2020,
              "prix": 25000
            }`,
          ],
          volume: 1,
        },
        headers: { "access-control-allow-origin": "*" },
        delayMs: 500,
      }
    ).as("apiSearchCall");

    cy.get("#saisieRecherche").should("exist");

    cy.get("#saisieRecherche")
      .invoke("attr", "value", "Toyota")
      .should("have.attr", "value", "Toyota");

    cy.get("section.box.search form").submit();

    cy.wait("@apiSearchCall");

    cy.get("tbody:first").within(() => {
      cy.get("tr").should("have.length", 1);

      cy.get("tr").within(() => {
        cy.get("td:nth-child(1)").should("contain.text", "Toyota");
        cy.get("td:nth-child(2)").should("contain.text", "Camry");
        cy.get("td:nth-child(3)").should("contain.text", "Sedan");
        cy.get("td:nth-child(4)").should("contain.text", "ESSENCE");
        cy.get("td:nth-child(5)").should("contain.text", "50000");
        cy.get("td:nth-child(6)").should("contain.text", "2020");
        cy.get("td:nth-child(7)").should("contain.text", "25000");
      });
    });
  });
});
