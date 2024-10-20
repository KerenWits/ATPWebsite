// import {
//   query,
//   where,
//   orderBy,
//   getDocs,
// } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import FirestoreService from "/firebase/query.js";
import Quote from "/classes/quote/quote.js";

class QuoteReportsService extends FirestoreService {
  constructor() {
    super("quotes");
  }

  // Income Report: Top 10 clients by amount within a time period
  async getIncomeReport(startDateTime, endDateTime) {
    // console.log("Start date", startDateTime);
    // console.log("End date", endDateTime);
    const whereConditions = [
      { field: Quote.sEndDateTime, operator: ">=", value: startDateTime },
      { field: Quote.sEndDateTime, operator: "<=", value: endDateTime },
      {
        field: Quote.sStatus,
        operator: "in",
        value: [Quote.sStatusCompleted, Quote.sStatusReviewed],
      },
    ];

    // console.log("getting data");
    const quotesSnapshot = await this.getDocuments({
      whereConditions: whereConditions,
    });
    // console.log("finished getting data");
    const clientAmounts = {};

    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      //   console.log("Quote data", quote);
      if (quote.clientId && quote.amount) {
        clientAmounts[quote.clientId] =
          (clientAmounts[quote.clientId] || 0) + quote.amount;
      }
    });

    const topClients = Object.entries(clientAmounts)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 10);

    return topClients; // Array of [clientId, amount]
  }

  // Services Rendered Report: Total amount by service within a time period
  async getServicesRenderedReport(startDateTime, endDateTime) {
    const whereConditions = [
      { field: Quote.sEndDateTime, operator: ">=", value: startDateTime },
      { field: Quote.sEndDateTime, operator: "<=", value: endDateTime },
      {
        field: Quote.sStatus,
        operator: "in",
        value: [Quote.sStatusCompleted, Quote.sStatusReviewed],
      },
    ];

    const quotesSnapshot = await this.getDocuments({
      whereConditions: whereConditions,
    });
    const serviceData = {};

    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      if (quote.serviceId && quote.amount) {
        if (!serviceData[quote.serviceId]) {
          serviceData[quote.serviceId] = { count: 0, amount: 0 };
        }
        serviceData[quote.serviceId].count += 1;
        serviceData[quote.serviceId].amount += quote.amount;
      }
    });

    // Convert serviceData to an array of entries, sort by amount, and convert back to an object
    const sortedServiceData = Object.entries(serviceData)
      .sort((a, b) => b[1].amount - a[1].amount)
      .reduce((acc, [serviceId, data]) => {
        acc[serviceId] = data;
        return acc;
      }, {});

    return sortedServiceData; // Object with serviceId as key and total amount as value, sorted by amount
  }

  // Client Risk Profile Report: Calculate risk for each client within a time period
  async getClientRiskProfileReport(startDateTime, endDateTime) {
    const whereConditions = [
      { field: Quote.sEndDateTime, operator: ">=", value: startDateTime },
      { field: Quote.sEndDateTime, operator: "<=", value: endDateTime },
      {
        field: Quote.sStatus,
        operator: "in",
        value: [Quote.sStatusCompleted, Quote.sStatusReviewed],
      },
    ];

    const quotesSnapshot = await this.getDocuments({
      whereConditions: whereConditions,
    });
    const clientRiskProfiles = {};

    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      if (quote.clientId && quote.raAnswers && Array.isArray(quote.raAnswers)) {
        const totalRisk = quote.raAnswers.reduce(
          (acc, ra) => acc + Number(ra.answer),
          0
        );
        const averageRisk = totalRisk / quote.raAnswers.length;

        if (!clientRiskProfiles[quote.clientId]) {
          clientRiskProfiles[quote.clientId] = { totalRisk: 0, count: 0 };
        }

        clientRiskProfiles[quote.clientId].totalRisk += averageRisk;
        clientRiskProfiles[quote.clientId].count += 1;
      }
    });

    const clientRiskRatings = Object.entries(clientRiskProfiles).map(
      ([clientId, { totalRisk, count }]) => {
        const averageClientRisk = totalRisk / count;
        let riskLevel;

        if (averageClientRisk < 0.333) {
          riskLevel = "Low-Risk";
        } else if (averageClientRisk < 0.666) {
          riskLevel = "Medium-Risk";
        } else {
          riskLevel = "High-Risk";
        }

        return { clientId, averageRisk: averageClientRisk, riskLevel };
      }
    );

    // Group by risk level
    const groupedByRiskLevel = clientRiskRatings.reduce((acc, client) => {
      if (!acc[client.riskLevel]) {
        acc[client.riskLevel] = [];
      }
      acc[client.riskLevel].push(client);
      return acc;
    }, {});

    return groupedByRiskLevel; // Object with risk levels as keys and arrays of clients as values
  }
}

export default QuoteReportsService;
