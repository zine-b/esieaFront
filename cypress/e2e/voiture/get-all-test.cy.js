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
  });
});
