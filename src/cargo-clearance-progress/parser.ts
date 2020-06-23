import { parse as parseXML } from "fast-xml-parser";
import * as moment from "moment-timezone";

import {
  CompactQueryResultRecord,
  DetailedQueryResult,
  MultipleQueryResult,
  QueryResult,
} from "./types";

export { QueryResult };

export class CargoClearanceProgressParser {
  public parse(buf: Buffer): QueryResult {
    const xml = buf.toString("utf8");
    const parsed = parseXML(xml, {
      arrayMode: "strict",
      parseNodeValue: false,
    });

    const { root, recordsFound } = this.validate(parsed?.cargCsclPrgsInfoQryRtnVo?.[0]);

    // Multiple Results
    if (recordsFound > 1) {
      return this.parseMultipleQueryResult(root);
    }

    // Single, Detailed Result
    if (recordsFound === 1) {
      return this.parseDetailedQueryResult(root);
    }

    // Zero results
    return null;
  }

  private parseMultipleQueryResult(root: any): MultipleQueryResult {
    const nodes = root.cargCsclPrgsInfoQryVo || [];

    return {
      type: "MULTIPLE",
      records: nodes.map((node: any): CompactQueryResultRecord => ({
        ref: node.cargMtNo?.[0],
        houseBL: node.hblNo?.[0],
        masterBL: node.mblNo?.[0],
        arrival: {
          date: moment.tz(node.etprDt?.[0], "YYYYMMDD", true, "Asia/Seoul").toDate(),
          port: {
            code: node.dsprCd?.[0],
            name: node.dsprNm?.[0],
          },
        },
        carrier: {
          code: node.shcoFlcoSgn?.[0],
          name: node.shcoFlco?.[0],
        },
      })),
    };
  }

  private parseDetailedQueryResult(root: any): DetailedQueryResult {
    const info = root.cargCsclPrgsInfoQryVo?.[0] || {};
    const events = root.cargCsclPrgsInfoDtlQryVo || [];

    return {
      type: "DETAILED",
      ref: info.cargMtNo?.[0],
      masterBL: info.mblNo?.[0],
      houseBL: info.hblNo?.[0],
      arrival: {
        date: moment.tz(info.etprDt?.[0], "YYYYMMDD", true, "Asia/Seoul").toDate(),
        port: {
          code: info.dsprCd?.[0],
          name: info.dsprNm?.[0],
        },
        customs: info.etprCstm?.[0],
      },
      carrier: {
        code: info.shcoFlcoSgn?.[0],
        name: info.shcoFlco?.[0],
      },
      cargo: {
        type: info.cargTp?.[0],
        specialCargoCode: info.spcnCargCd?.[0],
        hasDelayedClearanceTax: info.dclrDelyAdtxYn?.[0] === "Y",
        hasReleasePeriodPassedDuty: info.rlseDtyPridPassTpcd?.[0] === "Y",
        isManagedTarget: info.mtTrgtCargYnNm?.[0] === "Y",
      },
      clearance: {
        summary: info.csclPrgsStts?.[0],
      },
      status: {
        code: info.prgsStCd?.[0],
        summary: info.prgsStts?.[0],
        updatedAt: moment.tz(info.prcsDttm?.[0], "YYYYMMDDHHmmss", true, "Asia/Seoul").toDate(),
      },
      voyage: info.vydf?.[0],
      product: info.prnm?.[0],
      load: {
        country: info.lodCntyCd?.[0],
        port: {
          code: info.ldprCd?.[0],
          name: info.ldprNm?.[0],
        },
      },
      ship: {
        nationality: {
          code: info.shipNat?.[0],
          name: info.shipNatNm?.[0],
        },
        name: info.shipNm?.[0],
      },
      billType: {
        code: info.blPt?.[0],
        name: info.blPtNm?.[0],
      },
      container: {
        ref: info.cntrNo?.[0],
        count: parseInt(info.cntrGcnt?.[0], 10),
      },
      forwarder: {
        sign: info.frwrSgn?.[0],
        name: info.frwrEntsConm?.[0],
      },
      measurement: parseFloat(info.msrm?.[0]) || 0,
      weight: {
        unit: info.wghtUt?.[0],
        value: parseFloat(info.ttwg?.[0]) || 0,
      },
      package: {
        unit: info.pckUt?.[0],
        value: parseFloat(info.pckGcnt?.[0]) || 0,
      },
      agency: info.agnc?.[0],
      events: events.map((node: any) => ({
        summary: node.cargTrcnRelaBsopTpcd?.[0],
        updatedAt: moment.tz(node.prcsDttm?.[0], "YYYYMMDDHHmmss", true, "Asia/Seoul").toDate(),
        shed: {
          code: node.shedSgn?.[0] || undefined,
          name: node.shedNm?.[0] || undefined,
        },
        declarationId: node.dclrNo?.[0] || undefined,
        weight: {
          unit: node.wghtUt?.[0] || undefined,
          value: parseFloat(node.wght?.[0]) || undefined,
        },
        carry: {
          date: node.rlbrDttm?.[0] && moment.tz(node.rlbrDttm?.[0], "YYYY-MM-DD HH:mm:ss", true, "Asia/Seoul").toDate(),
          summary: node.rlbrCn?.[0] || undefined,
          notes: node.rlbrBssNo?.[0] || undefined,
        },
        notes: node.bfhnGdncCn?.[0] || undefined,
        package: {
          unit: node.pckUt?.[0] || undefined,
          value: parseFloat(node.pckGcnt?.[0]) || undefined,
        },
      })),
    };
  }

  private validate(root: any) {
    if (!root) {
      throw new Error("Unexpected XML");
    }

    const info: string = root.ntceInfo?.[0] || "";

    const recordsFound: number = (() => {
      const parsed = parseInt(root.tCnt?.[0], 10);
      const value = Number.isNaN(parsed) ? -1 : parsed;

      // WTF?
      //
      // 조회결과가 단건이면 상세내용을 제공하고 다건이면 목록을 제공합니다
      // * ntceInfo(오류메시지 공통컬럼)에 "[N00]"으로 시작하는 메세지가 리턴되면
      // 다건으로 판단하시고 목록조회 프로그램 개발하시면 됩니다.
      const hasMultipleEntities = info.includes("[N00]");

      if (!hasMultipleEntities) {
        return Math.min(value, 1);
      }

      return value;
    })();

    // Error
    if (recordsFound === -1) {
      // Invalid Key
      if (info.includes("존재하지 않는 인증키")) {
        throw new Error("Invalid API Key");
      }

      // Missing param
      if (info.includes("필수입력")) {
        // Missing credential
        if (info.includes("인증키")) {
          throw new Error("Missing API Key");
        }

        throw new Error("Missing one of required parameters");
      }

      // Unknown Error
      throw new Error(`Unknown Error (got: ${info || "unknown"})`);
    }

    return { root, recordsFound };
  }
}
