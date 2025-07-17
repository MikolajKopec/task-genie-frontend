// Define available types as an enumeration for better type-checking
export enum AvailableTypes {
  String = 'string',
  Boolean = 'boolean',
  Integer = 'integer',
  Enum = 'enum',
  Object = 'object',
  Array = 'array',
  ArrayOfNormalTypes = 'arrayOfNormalTypes'
}

// Property interface to describe each property's schema
export interface Property {
  type?: AvailableTypes;
  title?: string;
  default?: any;
  enum?: any[];

  items?: {
    type?: AvailableTypes;
    enum?: any[];
    $ref?: string;
  };
  allOf?: Array<{
    $ref: string;
  }>;
}

// For definitions ($defs) that may be referenced in properties
export interface Definitions {
  [key: string]: {
    type?: AvailableTypes;
    properties?: { [key: string]: Property };
    enum?: any[];
    title?: string;
  };
}

// Schema interface to describe the overall settings schema
export interface Schema {
  title: string;
  properties: { [key: string]: Property };
  $defs?: Definitions;
  type?: AvailableTypes;
}

// Main settings object interface which will be passed as an input to the component
export interface SettingsObject {
  file_path: string;
  schema: Schema;
  values?: { [key: string]: any };  // Optional values matching the schema properties
}

// Field interface to handle dynamic/static fields in the component
export interface Field {
  default?: any;
  key: string;
  value: Property;
  title?: string;
  defs?: Definitions;

}
