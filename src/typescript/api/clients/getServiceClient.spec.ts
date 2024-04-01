import getConnection from "../../db";
import getServiceClient from "./getServiceClient";

describe("getServiceClientTests", () => {
  before(() => {
    return getConnection();
  });

  it("should run", () => {
    getServiceClient();
  });

  it("should return a client that delegates to services properly", () => {
    const client = getServiceClient();
    return client.crags.addArea("1", {
      name: "New Area Huzzah",
      description: "Huzzah",
      polygon: {
        coordinates: [],
      },
    });
  });
});
