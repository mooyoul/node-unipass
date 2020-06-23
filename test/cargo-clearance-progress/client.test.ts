import * as nock from "nock";
import { sandbox } from "../helper";

import { CargoClearanceProgress } from "../../src/cargo-clearance-progress/client";
import { CargoClearanceProgressParser } from "../../src/cargo-clearance-progress/parser";

describe(CargoClearanceProgress.name, () => {
  let parser: CargoClearanceProgressParser;
  let api: CargoClearanceProgress;

  let scope: nock.Scope;
  let interceptor: nock.Interceptor;

  beforeEach(() => {
    parser = new CargoClearanceProgressParser();
    api = new CargoClearanceProgress("API_KEY", parser as any);
    nock.disableNetConnect();

    scope = nock("https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry");
    interceptor = scope.get("/retrieveCargCsclPrgsInfo");
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("#findByRef", () => {
    it("should return results on network failure", async () => {
      const bufResponse = Buffer.from("fake");

      interceptor
        .query({ crkyCn: "API_KEY", cargMtNo: "ref" })
        .reply(500, "Internal Server Error");

      sandbox.mock(parser)
        .expects("parse")
        .never();

      await expect(() =>
        api.findByRef("ref"),
      ).rejects.toThrow(/a/);

      expect(scope.isDone()).toBeTruthy();
    });

    it("should return results on parser failure", async () => {
      const bufResponse = Buffer.from("fake");

      interceptor
        .query({ crkyCn: "API_KEY", cargMtNo: "ref" })
        .reply(200, bufResponse);

      const error = new Error("MOCKED");

      sandbox.mock(parser)
        .expects("parse")
        .withArgs(bufResponse)
        .rejects(error);

      await expect(() =>
        api.findByRef("ref"),
      ).rejects.toThrow(error);

      expect(scope.isDone()).toBeTruthy();
    });

    it("should return results on success", async () => {
      const bufResponse = Buffer.from("fake");

      interceptor
        .query({ crkyCn: "API_KEY", cargMtNo: "ref" })
        .reply(200, bufResponse);

      const result = { type: "DETAILED", mocked: true };

      sandbox.mock(parser)
        .expects("parse")
        .withArgs(bufResponse)
        .returns(result);

      await expect(api.findByRef("ref")).resolves.toEqual(result);
      expect(scope.isDone()).toBeTruthy();
    });
  });
});

