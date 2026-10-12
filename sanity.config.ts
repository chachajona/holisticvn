import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

const singletonTypes = new Set(["siteSettings", "servicesPage", "methodsPage"]);

export default defineConfig({
  name: "holisticvn",
  title: "HolisticVN CMS",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Nội dung")
          .items([
            S.listItem()
              .title("Thiết lập website")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Trang Dịch vụ")
              .id("servicesPage")
              .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
            S.listItem()
              .title("Trang Phương pháp")
              .id("methodsPage")
              .child(S.document().schemaType("methodsPage").documentId("methodsPage")),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? "")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((template) => !singletonTypes.has(template.templateId))
        : prev,
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(
            ({ action }) => action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : prev,
  },
});
