import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CargoClearanceProgressParser, QueryResult } from "./parser";

export class CargoClearanceProgress {
  // tslint:disable-next-line
  private readonly API_ENDPOINT = "https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo";

  public constructor(
    public apiKey: string,
    private parser: CargoClearanceProgressParser = new CargoClearanceProgressParser(),
  ) {}

  public async findByRef(
    ref: string,
  ): Promise<QueryResult> {
    const res = await this.request({
      params: {
        cargMtNo: ref,
      },
    });

    return this.parser.parse(res.data);
  }

  public async findByMasterBL(
    masterBL: string,
    year: number = new Date().getFullYear(),
  ): Promise<QueryResult> {
    const res = await this.request({
      params: {
        mblNo: masterBL,
        blYy: year,
      },
    });

    return this.parser.parse(res.data);
  }

  public async findByHouseBL(
    houseBL: string,
    year: number = new Date().getFullYear(),
  ): Promise<QueryResult> {
    const res = await this.request({
      params: {
        hblNo: houseBL,
        blYy: year,
      },
    });

    return this.parser.parse(res.data);
  }

  public async findByFullBL(
    masterBL: string,
    houseBL: string,
    year: number = new Date().getFullYear(),
  ): Promise<QueryResult> {
    const res = await this.request({
      params: {
        mblNo: masterBL,
        hblNo: houseBL,
        blYy: year,
      },
    });

    return this.parser.parse(res.data);
  }

  private request(config: AxiosRequestConfig): Promise<AxiosResponse<Buffer>> {
    const params = config.params ?? {};

    return axios({
      method: "GET",
      url: this.API_ENDPOINT,
      params: {
        crkyCn: this.apiKey,
        ...params,
      },
      responseType: "arraybuffer",
    });
  }
}
