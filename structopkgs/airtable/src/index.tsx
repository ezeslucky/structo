export * from "./RecordData";
import {
  registerAirtableCollection,
  registerAirtableCredentialsProvider,
  registerAirtableRecord,
  registerAirtableRecordField,
} from "./RecordData";
import registerComponent from "@structoapp/host/registerComponent";
import registerGlobalContext from "@structoapp/host/registerGlobalContext";

export function registerAll(loader?: {
  registerComponent: typeof registerComponent;
  registerGlobalContext: typeof registerGlobalContext;
}) {
  registerAirtableCollection(loader);
  registerAirtableCredentialsProvider(loader);
  registerAirtableRecord(loader);
  registerAirtableRecordField(loader);
}
