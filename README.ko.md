# node-unipass

[English](/README.md) | **한국어 (Korean, Current)**

[![Build Status](https://github.com/mooyoul/geo-pattern/workflows/workflow/badge.svg)](https://github.com/mooyoul/geo-pattern/actions)
[![Semantic Release enabled](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://mooyoul.mit-license.org/)

[관세청 국가 관세 정보망 서비스 (Unipass)](https://unipass.customs.go.kr/) Node.js API 클라이언트

## 지원 서비스

- 수입화물 진행정보 조회 (화물 통관 진행정보 조회)

현재 `node-unipass`는 "수입화물 진행정보 조회" 서비스만 지원합니다.  

## 시작하기

```bash
$ npm install unipass --save
```

## API

### CargoClearanceProgress

#### 참고사항

일부 특수 조건에서는 (e.g. Master B/L으로 조회하는 경우, 동일한 House B/L이 존재하는 경우 등)
복수 화물에 대한 결과가 존재할 수 있습니다.

복수 화물에 대한 조회 결과는 화물에 대한 상세한 정보를 제공하지 않으므로, 클라이언트는 조회 결과에 따라 적합한 처리 (e.g. UI 표시)를 할 수 있어야 합니다.

응답을 처리하는 간략한 예시는 다음과 같습니다.

```typescript
const result = await client.findByRef("ref");

if (!result) {
  // 결과 없음
  renderError();
} else if (result.type === "MULTIPLE") {
  // 복수 결과
  renderList(result);
} else {
  // 단일 결과
  renderDetail(result);
}
```   

#### Types

```typescript
export interface CompactQueryResultRecord {
  // 화물관리번호
  ref: string;

  // MBL 번호
  masterBL: string;

  // HBL 번호
  houseBL: string;

  arrival: {
    // 입항일자
    date: Date;
    port: {
      // 양륙항코드
      code: string; // "KRINC"
      // 양륙항명
      name: string; // "인천항"
    };
  };

  carrier: {
    // 선사항공사부호
    code: string; // "WDFC"
    // 선사항공사
    name: string; // "(주)위동해운"
  };
}

export interface MultipleQueryResult {
  type: "MULTIPLE";
  records: CompactQueryResultRecord[];
}

export interface DeclarationEvent {
  // 처리구분
  summary: string; // 통관목록접수

  // 처리일시
  updatedAt: Date;

  shed: {
    // 장치장부호
    code: string; // 02002079
    // 장치장명
    name: string; // 인천세관 제2지정장치장
  };

  // 신고번호
  declarationId: string;

  weight: {
    // 중량
    value: number; // 1.4

    // 중량단위
    unit: string; // KG
  };

  carry: {
    // 반출입일시
    date: Date;
    // 반출입내용
    summary: string; // 목록통관특송물품 반출
    // 반출입근거번호
    notes: string;
  };

  // 사전안내내용
  notes: string; // [부가사항] 인천세관 제2지정장치장의 장치기간은 최대 6 개월 입니다.

  package: {
    // 포장단위
    unit: string;
    // 포장개수
    value: number; // 1
  };
}

export interface DetailedQueryResult {
  type: "DETAILED";

  // 화물관리번호
  ref: string;

  // MBL 번호
  masterBL: string;

  // HBL 번호
  houseBL: string;

  arrival: {
    // 입항일자
    date: Date;
    port: {
      // 양륙항코드
      code: string; // "KRINC"
      // 양륙항명
      name: string; // "인천항"
    };
    // 입항세관
    customs: string; // "인천세관"
  };

  carrier: {
    // 선사항공사부호
    code: string; // "WDFC"
    // 선사항공사
    name: string; // "(주)위동해운"
  };


  cargo: {
    // 화물구분
    type: string; // "수입 일반화물"

    // 특수화물코드
    specialCargoCode: string;

    // 신고지연가산세여부
    hasDelayedClearanceTax: boolean;

    // 반출의무과태료여부
    hasReleasePeriodPassedDuty: boolean;

    // 관리대상화물여부명
    isManagedTarget: boolean;
  };

  // 통관진행상태
  clearance: {
    summary: string; // "통관목록심사완료"
  };

  status: {
    // 진행상태코드
    code: string; // "CAGB08"

    // 진행상태
    summary: string; // 하선장소 반입기간연장 승인신청

    // 처리일시
    updatedAt: Date;
  };


  // 항차
  voyage: string; // "0262"

  // 품명
  product: string; // "SOCKET 2 ,TELECONTROLLER 1 ,INTELLIGENT GATEWAY 1"

  load: {
    // 적출국가코드
    country: string; // "CN"

    // 적재항
    port: {
      // 적재항코드
      code: string; // "CNWEI"
      // 적재항명
      name: string; // "Weihai"
    };
  };

  ship: {
    nationality: {
      // 선박국적
      code: string; // "PA"

      // 선박국적명
      name: string; // "파나마"
    };
    // 선박명
    name: string; // "NEWGOLDENBRIDGE 7"
  };

  billType: {
    // B/L유형
    code: string; // "X"

    // B/L 유형명
    name: string; // "특송화물 Sample"
  };

  container: {
    // 컨테이너번호
    // "WDFU3013910"
    ref: string;

    // 컨테이너개수
    count: number; // 1
  };

  forwarder: {
    // 포워더부호
    sign: string; // "WINL"
    // 포워더명
    name: string; // "주식회사 윈핸드해운항공"
  };

  // 용적
  measurement: number; // 0.015

  weight: {
    // 중량단위
    unit: string; // "KG"
    // 총중량
    value: number; // 1.4
  };

  package: {
    // 포장단위
    unit: string; // GT
    // 포장개수
    value: number; // 1
  };

  // 대리점
  agency: string; // (주) 위동해운

  events: DeclarationEvent[];
}

export type QueryResult = MultipleQueryResult | DetailedQueryResult | null;
```

#### `findByRef(ref: string) => Promise<QueryResult>`

주어진 화물관리번호에 해당하는 수입화물 통관 진행정보를 조회하고 결과를 반환합니다.

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByRef("ref");
```

#### `findByMasterBL(masterBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

주어진 Master B/L에 해당하는 수입화물 통관 진행정보를 조회하고 결과를 반환합니다.

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByMasterBL("MASTER_BL");
// or
const result = await client.findByMasterBL("MASTER_BL", 2019);
```

#### `findByHouseBL(houseBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

주어진 House B/L에 해당하는 수입화물 통관 진행정보를 조회하고 결과를 반환합니다.

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByHouseBL("HOUSE_BL");
// or
const result = await client.findByHouseBL("HOUSE_BL", 2019);
```

#### `findByFullBL(masterBL: string, houseBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

주어진 B/L에 해당하는 수입화물 통관 진행정보를 조회하고 결과를 반환합니다.

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByFullBL("MASTER_BL", "HOUSE_BL");
// or
const result = await client.findByFullBL("MASTER_BL", "HOUSE_BL", 2019);
```

## 변경사항

[CHANGELOG](/CHANGELOG.md)을 참고하세요.

## Testing

```bash
$ npm test
```

## Build

```bash
$ npm run build
```

## License
[MIT](LICENSE)

See full license on [mooyoul.mit-license.org](http://mooyoul.mit-license.org/)

