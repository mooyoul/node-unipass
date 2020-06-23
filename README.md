# node-unipass

**English (Current)** | [한국어 (Korean)](/README.ko.md)

[![Build Status](https://github.com/mooyoul/geo-pattern/workflows/workflow/badge.svg)](https://github.com/mooyoul/geo-pattern/actions)
[![Semantic Release enabled](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://mooyoul.mit-license.org/)

Node.js API for accessing [Unipass (Customs Clearance System of Korean Customs Service)](https://unipass.customs.go.kr/)

## Supported Features

- Cargo Clearance Progress Tracking

Currently, `node-unipass` only supports "Cargo Clearance Progress Tracking" API. 

## Getting Started

```bash
$ npm install unipass --save
```

## API

### CargoClearanceProgress

#### Notes

Query results may contain multiple cargo entities in special cases.
(e.g. Given Master B/L contains multiple House B/L) 

If query results refers multiple cargo entities, 
It won't provide detailed information about cargo (or clearance events)

Due to this behavior, Clients should handle query result type and take appropriate actions 
(e.g. Displaying different UI per different result types)

Below is an example of query result handling:

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
  // Cargo Management No.
  ref: string;

  // Master BL No.
  masterBL: string;

  // Hous BL No.
  houseBL: string;

  // Arrival Information
  arrival: {
    // Arrival Date
    date: Date;
    // Arrival Port
    port: {
      code: string; // "KRINC"
      name: string; // "인천항"
    };
  };

  // Carrier Information
  carrier: {
    code: string; // "WDFC"
    name: string; // "(주)위동해운"
  };
}

export interface MultipleQueryResult {
  type: "MULTIPLE";
  records: CompactQueryResultRecord[];
}

export interface DeclarationEvent {
  summary: string;
  updatedAt: Date;
  shed: {
    code: string;
    name: string;
  };
  declarationId: string;
  weight: {
    value: number;
    unit: string;
  };
  carry: {
    date: Date;
    summary: string;
    notes: string;
  };
  notes: string;
  package: {
    unit: string;
    value: number;
  };
}

export interface DetailedQueryResult {
  type: "DETAILED";

  ref: string;
  masterBL: string;
  houseBL: string;
  arrival: {
    date: Date;
    port: {
      code: string;
      // 양륙항명
      name: string;
    };
    customs: string;
  };
  carrier: {
    code: string;
    name: string;
  };
  cargo: {
    type: string;
    specialCargoCode: string;
    hasDelayedClearanceTax: boolean;
    hasReleasePeriodPassedDuty: boolean;
    isManagedTarget: boolean;
  };
  clearance: {
    summary: string;
  };
  status: {
    code: string;
    summary: string;
    updatedAt: Date;
  };
  voyage: string;
  product: string;
  load: {
    country: string;
    port: {
      code: string;
      name: string;
    };
  };
  ship: {
    nationality: {
      code: string;
      name: string;
    };
    name: string;
  };
  billType: {
    code: string;
    name: string;
  };
  container: {
    ref: string;
    count: number;
  };
  forwarder: {
    sign: string;
    name: string;
  };
  measurement: number;
  weight: {
    unit: string;
    value: number;
  };
  package: {
    unit: string;
    value: number;
  };
  agency: string;
  events: DeclarationEvent[];
}

export type QueryResult = MultipleQueryResult | DetailedQueryResult | null;
```

#### `findByRef(ref: string) => Promise<QueryResult>`

Find Cargo Clearance Progress by given Reference (Cargo Management No.)

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByRef("ref");
```

#### `findByMasterBL(masterBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

Find Cargo Clearance Progress by given Master B/L

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByMasterBL("MASTER_BL");
// or
const result = await client.findByMasterBL("MASTER_BL", 2019);
```

#### `findByHouseBL(houseBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

Find Cargo Clearance Progress by given House B/L

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByHouseBL("HOUSE_BL");
// or
const result = await client.findByHouseBL("HOUSE_BL", 2019);
```

#### `findByFullBL(masterBL: string, houseBL: string, year: number = new Date().getFullYear()) => Promise<QueryResult>`

Find Cargo Clearance Progress by given House B/L and Master B/L

```typescript

import { CargoClearanceProgress } from "unipass";
const client = new CargoClearanceProgress("API_KEY");
const result = await client.findByFullBL("MASTER_BL", "HOUSE_BL");
// or
const result = await client.findByFullBL("MASTER_BL", "HOUSE_BL", 2019);
```

## Changelog

See [CHANGELOG](/CHANGELOG.md).

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

