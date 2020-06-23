import { readFixture } from "../helper";

import { CargoClearanceProgressParser } from "../../src/cargo-clearance-progress/parser";

describe(CargoClearanceProgressParser.name, () => {
  let parser: CargoClearanceProgressParser;

  beforeEach(() => {
    parser = new CargoClearanceProgressParser();
  });
  describe("Errors", () => {
    it("should throw Error when parser received malformed response", () => {
      const fixture = Buffer.from("<unknown></unknown>", "utf8");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Unexpected XML");
    });

    it("should throw Error when parser received invalid key response", async () => {
      const fixture = await readFixture("invalid-key.xml");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Invalid API Key");
    });

    it("should throw Error when parser received missing key response", async () => {
      const fixture = await readFixture("missing-key.xml");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Missing API Key");
    });

    it("should throw Error when parser received missing required param response", async () => {
      const fixture = await readFixture("missing-reference.xml");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Missing one of required parameters");
    });

    it("should throw Error when parser received unknown error with reason", () => {
      const fixture = Buffer.from("<cargCsclPrgsInfoQryRtnVo><ntceInfo>wut</ntceInfo></cargCsclPrgsInfoQryRtnVo>", "utf8");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Unknown Error (got: wut)");
    });

    it("should throw Error when parser received unknown error without reason", () => {
      const fixture = Buffer.from("<cargCsclPrgsInfoQryRtnVo><ntceInfo></ntceInfo></cargCsclPrgsInfoQryRtnVo>", "utf8");

      expect(() =>
        parser.parse(fixture),
      ).toThrow("Unknown Error (got: unknown)");
    });

  });

  describe("Empty Results", () => {
    it("should return null", async () => {
      const fixture = await readFixture("empty-results.xml");

      expect(parser.parse(fixture)).toEqual(null);
    });
  });

  describe("Multiple Results", () => {
    it("should return MultipleQueryResult", async () => {
      const fixture = await readFixture("multiple-results.xml");

      expect(parser.parse(fixture)).toMatchSnapshot();
    });
  });

  describe("Detailed Results", () => {
    it("should return DetailedQueryResult for in-progress result", async () => {
      const fixture = await readFixture("in-progress.xml");

      expect(parser.parse(fixture)).toMatchSnapshot();
    });

    it(`should return DetailedQueryResult for completed result`, async () => {
      const fixtures = [
        "completed-cn-air.xml",
        "completed-cn-ship.xml",
        "completed-hk-air.xml",
        "completed-uk-air.xml",
        "completed-us-air.xml",
        "completed-us-air2.xml",
        "completed-us-air3.xml",
      ];

      for (const name of fixtures) {
        const fixture = await readFixture(name);

        expect(parser.parse(fixture)).toMatchSnapshot();
      }
    });
  });
});

