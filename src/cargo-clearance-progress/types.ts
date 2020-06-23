export interface CompactQueryResultRecord {
  // 화물관리번호
  ref: string; // cargMtNo

  // MBL 번호
  masterBL: string; // mblNo

  // HBL 번호
  houseBL: string; // hblNo

  arrival: {
    // 입항일자
    date: Date; // etprDt "20200608"
    port: {
      // 양륙항코드
      code: string; // dsprCd "KRINC"
      // 양륙항명
      name: string; // dsprNm "인천항"
    };
  };

  carrier: {
    // 선사항공사부호
    code: string; // shcoFlcoSgn "WDFC"
    // 선사항공사
    name: string; // shcoFlco "(주)위동해운"
  };
}

export interface MultipleQueryResult {
  type: "MULTIPLE";
  records: CompactQueryResultRecord[];
}

export interface DeclarationEvent {
  // 처리구분
  summary: string; // <cargTrcnRelaBsopTpcd>통관목록접수</cargTrcnRelaBsopTpcd>

  // 처리일시
  updatedAt: Date; // <prcsDttm>20200608105904</prcsDttm>

  shed: {
    // 장치장부호
    code?: string; // <shedSgn/>
    // 장치장명
    name?: string; // <shedNm/>
  };

  // 신고번호
  declarationId?: string; // <dclrNo>SE02072000000127</dclrNo>

  weight: {
    // 중량
    value?: number; // <wght>1.4</wght>

    // 중량단위
    unit?: string; // <wghtUt>KG</wghtUt>
  };

  carry: {
    // 반출입일시
    date?: Date | null; // <rlbrDttm/>
    // 반출입내용
    summary?: string; // <rlbrCn/>
    // 반출입근거번호
    notes?: string; // <rlbrBssNo/>
  };

  // 사전안내내용
  notes?: string; // <bfhnGdncCn/>

  package: {
    // 포장개수
    unit?: string; // <pckGcnt>1</pckGcnt>
    // 포장단위
    value?: number; // <pckUt/>
  };
}

export interface DetailedQueryResult {
  type: "DETAILED";

  // 화물관리번호
  ref: string; // cargMtNo

  // MBL 번호
  masterBL: string; // mblNo

  // HBL 번호
  houseBL: string; // hblNo

  arrival: {
    // 입항일자
    date: Date; // etprDt "20200608"
    port: {
      // 양륙항코드
      code: string; // dsprCd "KRINC"
      // 양륙항명
      name: string; // dsprNm "인천항"
    };
    // 입항세관
    customs: string; // // <etprCstm>인천세관</etprCstm>
  };

  carrier: {
    // 선사항공사부호
    code: string; // shcoFlcoSgn "WDFC"
    // 선사항공사
    name: string; // shcoFlco "(주)위동해운"
  };


  cargo: {
    // 화물구분
    type: string; // <cargTp>수입 일반화물</cargTp>

    // 특수화물코드
    specialCargoCode: string; // <spcnCargCd/>

    // 신고지연가산세여부
    hasDelayedClearanceTax: boolean; // <dclrDelyAdtxYn>N</dclrDelyAdtxYn>

    // 반출의무과태료여부
    hasReleasePeriodPassedDuty: boolean; // <rlseDtyPridPassTpcd>N</rlseDtyPridPassTpcd>

    // 관리대상화물여부명
    isManagedTarget: boolean; // <mtTrgtCargYnNm>N</mtTrgtCargYnNm>
  };

  // 통관진행상태
  clearance: {
    summary: string; // <csclPrgsStts>통관목록심사완료</csclPrgsStts>
  };

  status: {
    // 진행상태코드
    code: string; // <prgsStCd>CAGB08</prgsStCd>

    // 진행상태
    summary: string; // <prgsStts>하선장소 반입기간연장 승인신청</prgsStts>

    // 처리일시
    updatedAt: Date; // <prcsDttm>20200612151300</prcsDttm>
  };


  // 항차
  voyage: string; // <vydf>0262</vydf>

  // 품명
  product: string; // <prnm>SOCKET 2 ,TELECONTROLLER 1 ,INTELLIGENT GATEWAY 1</prnm>

  load: {
    // 적출국가코드
    country: string; // <lodCntyCd>CN</lodCntyCd>

    // 적재항
    port: {
      // 적재항코드
      code: string; // <ldprCd>CNWEI</ldprCd>
      // 적재항명
      name: string; // <ldprNm>Weihai</ldprNm>
    };
  };

  ship: {
    nationality: {
      // 선박국적
      code: string; // <shipNat>PA</shipNat>

      // 선박국적명
      name: string; // <shipNatNm>파나마</shipNatNm>
    };
    // 선박명
    name: string; // <shipNm>NEWGOLDENBRIDGE 7</shipNm>
  };

  billType: {
    // B/L유형
    code: string; // <blPt>X</blPt>

    // B/L 유형명
    name: string; // <blPtNm>특송화물 Sample</blPtNm>
  };

  container: {
    // 컨테이너번호
    // <cntrNo>WDFU3013910</cntrNo>
    ref: string;

    // 컨테이너개수
    count: number; // <cntrGcnt>1</cntrGcnt>
  };

  forwarder: {
    // 포워더부호
    sign: string; // <frwrSgn>WINL</frwrSgn>
    // 포워더명
    name: string; // <frwrEntsConm>주식회사 윈핸드해운항공</frwrEntsConm>
  };

  // 용적
  measurement: number; // <msrm>0.015</msrm>

  weight: {
    // 중량단위
    unit: string; // <wghtUt>KG</wghtUt>
    // 총중량
    value: number; // <ttwg>1.4</ttwg>
  };

  package: {
    // 포장단위
    unit: string; // <pckUt>GT</pckUt>
    // 포장개수
    value: number; // <pckGcnt>1</pckGcnt>
  };

  // 대리점
  agency: string; // <agnc>(주) 위동해운</agnc>

  events: DeclarationEvent[];
}

export type QueryResult = MultipleQueryResult | DetailedQueryResult | null;
