import {SettingsObject} from '../../shared/interfaces/main-settings'
import {RAGSection} from "../../shared/interfaces/rag-tools.interface";

export function parseAllSettings(jsonData: string): SettingsObject[] {
  if (jsonData == "") {
    throw Error
  }
  const result:SettingsObject[] = parseSettingsJson(jsonData);
  result.forEach((setting) => {
    if (setting.values){
      const dataToParse:any = setting.values
      console.log("data to parse", dataToParse)
      setting.values = JSON.parse(dataToParse);
      console.log("setting values", setting.values)
    }
  })
  console.log("data parsed to json", result)
  return result
}

function parseSettingsJson(jsonData: string): SettingsObject[] {
  try {
    const parsedObject: SettingsObject[] = JSON.parse(jsonData);
    console.log("Parsed obj: ", parsedObject)
    return parsedObject;
  } catch (error) {
    console.error("Failed to parse JSON string:", error);
    throw new Error("Invalid JSON format");
  }
}

export function parseJsonToObject<T>(jsonData:string): T{
  try {
    const parsedObject: T = JSON.parse(jsonData);
    console.log("Parsed obj: ", parsedObject)
    return parsedObject;
  } catch (error) {
    console.error("Failed to parse JSON string:", error);
    throw new Error("Invalid JSON format");
  }
}
