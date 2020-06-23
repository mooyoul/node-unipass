import { promises as fs } from "fs";
import * as path from "path";
import * as sinon from "sinon";

export async function readFixture(name: string) {
  const fixturePath = path.join(__dirname, "..", "fixtures", name);
  return await fs.readFile(fixturePath);
}

export const sandbox = sinon.createSandbox();

afterEach(() => {
  sandbox.verifyAndRestore();
});
