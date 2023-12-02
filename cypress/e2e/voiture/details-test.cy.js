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
          ],
          volume: 1,
        },
        headers: { "access-control-allow-origin": "*" },
        delayMs: 500,
      }
    ).as("apiCall");

    cy.intercept("GET", "http://localhost:8080/esieaBack/rest/voiture/get/1", {
      statusCode: 200,
      body: {
        voiture: `{
          "id": 1,
          "marque": "Toyota",
          "modele": "Camry",
          "finition": "Sedan",
          "carburant": "ESSENCE",
          "km": 50000,
          "annee": 2020,
          "prix": 25000
        }`,
      },
      headers: { "access-control-allow-origin": "*" },
      delayMs: 500,
    }).as("apiCall");

    cy.intercept("POST", "http://localhost:8080/esieaBack/rest/voiture/del", {
      statusCode: 200,
      headers: { "access-control-allow-origin": "*" },
      delayMs: 500,
    }).as("apiCall");

    cy.visit("http://localhost:8080/src/main/webapp/index.html");

    cy.get("#listeVoitureTable").should("exist");

    cy.wait("@apiCall");

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
        cy.get("td:nth-child(8) a").click();
      });
    });
  });
});
