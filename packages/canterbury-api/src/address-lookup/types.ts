
export type AddressAttributes = {
  Match_addr: string,
  Addr_type: string,
  LOCATOR_ENVELOPE: string,
  LOCATOR_POINT: string,
  LOCATOR_DESCRIPTION: string,
  LOCATOR_FAMILY_ID: string,
  LOCATOR_ID: string,
  LOCATOR_DATASET_ID: string,
  LOCATOR_DATASET_FAMILY_ID: string,
  LOCATOR_RESOLUTION: number,
  LOCATOR_SCORE: number,
  UPRN: string,
  BLPU_LOGICAL_STATUS: number,
  BLPU_STATE: number,
  BLPU_STATE_DATE: string,
  PARENT_UPRN: string,
  RPC: number,
  COUNTRY: string,
  BLPU_START_DATE: string,
  BLPU_END_DATE?: string,
  BLPU_LAST_UPDATE_DATE: string,
  BLPU_ENTRY_DATE: string,
  ORG_KEY: string,
  ORGANISATION: string,
  LEGAL_NAME: string,
  BLPU_CLASSES: string,
  MULTI_OCC_COUNT: number,
  ADDRESSBASE_POSTAL: string,
  POSTCODE: string,
  LOCAL_CUSTODIAN_CODE: number,
  LATITUDE: number,
  LONGITUDE: number,
  LPI_KEY: string,
  LPI_LANGUAGE: string,
  LPI_LOGICAL_STATUS: number,
  LPI_START_DATE: string,
  LPI_END_DATE: string,
  LPI_LAST_UPDATE_DATE: string,
  LPI_ENTRY_DATE: string,
  SAO_START_NUMBER: string,
  SAO_END_NUMBER: string,
  SAO_START_SUFFIX: string,
  SAO_END_SUFFIX: string,
  SAO_TEXT: string,
  PAO_START_NUMBER: string,
  PAO_END_NUMBER: string,
  PAO_START_SUFFIX: string,
  PAO_END_SUFFIX: string,
  PAO_TEXT: string,
  LEVEL_TEXT: string,
  OFFICIAL_FLAG: string,
  USRN_MATCH_INDICATOR: string,
  AREA_NAME: string,
  STREET_RECORD_TYPE: number,
  STREET_STATE: number,
  STREET_STATE_DATE: string,
  STREET_SURFACE: number,
  STREET_CLASSIFICATION: number,
  STREET_VERSION: number,
  STREET_ENTRY_DATE: string,
  STREET_LAST_UPDATE_DATE: string,
  STREET_START_DATE: string,
  STREET_END_DATE: null,
  STREET_TOLERANCE: number,
  STREET_START_X: number,
  STREET_START_Y: number,
  STREET_END_X: number,
  STREET_END_Y: number,
  STREET_START_LAT: number,
  STREET_START_LONG: number,
  STREET_END_LAT: number,
  STREET_END_LONG: number,
  STREET_DESCRIPTION: string,
  LOCALITY: string,
  ADMINISTRATIVE_AREA: string,
  TOWN_NAME: string,
  STREET_LANGUAGE: string,
  STREET_DESC_START_DATE: string,
  STREET_DESC_END_DATE: null,
  STREET_DESC_LAST_UPDATE_DATE: string,
  STREET_DESC_ENTRY_DATE: string,
  USRN: string,
  OS_ADDRESS_TOID: string,
  OS_ADDRESS_TOID_VERSION: number,
  OS_TOPO_TOID: string,
  OS_TOPO_TOID_VERSION: number,
  OS_TRANSPORT_TOID: string,
  OS_TRANSPORT_TOID_VERSION: number,
  COUNCIL_TAX_REFERENCE: string,
  NON_DOMESTIC_REFERENCE: string,
  WARD_CODE: string,
  PARISH_CODE: string,
  DPA_UDPRN: number,
  DPA_ORGANISATION_NAME: string,
  DPA_DEPARTMENT_NAME: string,
  DPA_SUB_BUILDING_NAME: string,
  DPA_BUILDING_NAME: string,
  DPA_BUILDING_NUMBER: 2,
  DPA_DEP_THOROUGHFARE: string,
  DPA_THOROUGHFARE: string,
  DPA_DOUBLE_DEP_LOCALITY: string,
  DPA_DEP_LOCALITY: string,
  DPA_POST_TOWN: string,
  DPA_POSTCODE: string,
  DPA_POSTCODE_TYPE: string,
  DPA_WELSH_DEP_THOROUGHFARE: string,
  DPA_WELSH_THOROUGHFARE: string,
  DPA_WELSH_DB_DEP_LOCALITY: string,
  DPA_WELSH_DEP_LOCALITY: string,
  DPA_WELSH_POST_TOWN: string,
  DPA_PO_BOX_NUMBER: string,
  DPA_PROCESS_DATE: string,
  DPA_START_DATE: string,
  DPA_END_DATE: null,
  DPA_ENTRY_DATE: string,
  DPA_LAST_UPDATE_DATE: string,
  DPA_DELIVERY_POINT_SUFFIX: string,
}

export type AddressCandidate = {
  address: string
  location: {
    x: number
    y: number
  }
  score: number
  attributes: AddressAttributes
}
 
export type AddressResults = {
  spatialReference: {
    wkid: number
    latestWkid: number
  },
  candidates: AddressCandidate[]
}