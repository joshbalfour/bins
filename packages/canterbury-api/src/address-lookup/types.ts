export type AddressCandidate = {
  ADDRESS: string;
  X_COORDINATE: number;
  Y_COORDINATE: number;
  UPRN: string;
  USRN: string;
  LPI_KEY: string;
  ORGANISATION: string;
  PAO_START_NUMBER: string;
  STREET_DESCRIPTION: string;
  TOWN_NAME: string;
  ADMINISTRATIVE_AREA: string;
  POSTCODE_LOCATOR: string;
  RPC: boolean;
  STATUS: string;
  LOGICAL_STATUS_CODE: string;
  CLASSIFICATION_CODE: string;
  CLASSIFICATION_CODE_DESCRIPTION: string;
  LOCAL_CUSTODIAN_CODE: number;
  LOCAL_CUSTODIAN_CODE_DESCRIPTION: string;
  COUNTRY_CODE: string;
  COUNTRY_CODE_DESCRIPTION: string;
  POSTAL_ADDRESS_CODE: string;
  POSTAL_ADDRESS_CODE_DESCRIPTION: string;
  BLPU_STATE_CODE: string;
  BLPU_STATE_CODE_DESCRIPTION: string;
  TOPOGRAPHY_LAYER_TOID: string;
  LAST_UPDATE_DATE: string;
  ENTRY_DATE: string;
  BLPU_STATE_DATE: string;
  STREET_STATE_CODE: string;
  STREET_STATE_CODE_DESCRIPTION: string;
  STREET_CLASSIFICATION_CODE: string;
  STREET_CLASSIFICATION_CODE_DESCRIPTION: string;
  LPI_LOGICAL_STATUS_CODE: string;
  LPI_LOGICAL_STATUS_CODE_DESCRIPTION: string;
  LANGUAGE: string;
  MATCH: boolean;
  MATCH_DESCRIPTION: string;
};

export type AddressResult = {
  LPI: AddressCandidate;
};

export type AddressResults = {
  header: {
    uri: string;
    query: string;
    offset: number;
    totalresults: number;
    format: string;
    dataset: string;
    lr: string;
    maxresults: number;
    epoch: string;
    lastupdate: string;
    output_srs: string;
  };
  results: AddressResult[];
};
