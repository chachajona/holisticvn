#!/usr/bin/env node
/**
 * Convert export files from the legacy system without touching production data.
 * Usage: npm run migrate:legacy -- ./exports/contacts.json ./exports/sanity.ndjson ./migration-output
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const [contactsPath, sanityPath, outputDir = "migration-output"] = process.argv.slice(2);
if (!contactsPath || !sanityPath) { console.error("Usage: npm run migrate:legacy -- <contacts.json> <sanity.ndjson> [output-dir]"); process.exit(1); }
if (!existsSync(contactsPath) || !existsSync(sanityPath)) { console.error("Export file not found."); process.exit(1); }
mkdirSync(outputDir, { recursive: true });
const contacts = JSON.parse(readFileSync(contactsPath, "utf8"));
const rows = Array.isArray(contacts) ? contacts : contacts.contacts || [];
const leads = rows.filter(row => row.contact_type !== "newsletter").map(row => ({ legacy_id: row.id, kind: row.contact_type === "booking" ? "booking" : "contact", name: row.name?.trim() || "Khách chưa đặt tên", phone: row.phone?.trim() || "", email: row.email?.trim() || null, message: row.message?.trim() || null, treatment_name: row.treatment_name || null, source: row.source || "legacy-import", status: ["new", "contacted", "confirmed", "completed", "lost"].includes(row.status) ? row.status : "new", created_at: row.created_at || new Date().toISOString() }));
const subscribers = rows.filter(row => row.contact_type === "newsletter" && row.email).map(row => ({ legacy_id: row.id, email: row.email.trim().toLowerCase(), status: "subscribed", created_at: row.created_at || new Date().toISOString() }));
const sanityDocuments = readFileSync(sanityPath, "utf8").trim().split("\n").filter(Boolean).map(line => JSON.parse(line)).filter(document => ["page", "service", "treatment", "testimonial", "faq", "siteSettings", "post"].includes(document._type)).map(document => ({ ...document, _id: `legacy-${document._id}`, _rev: undefined, _createdAt: undefined, _updatedAt: undefined }));
writeFileSync(join(outputDir, "leads.json"), JSON.stringify(leads, null, 2));
writeFileSync(join(outputDir, "newsletter-subscribers.json"), JSON.stringify(subscribers, null, 2));
writeFileSync(join(outputDir, "sanity.ndjson"), sanityDocuments.map(document => JSON.stringify(document)).join("\n") + "\n");
writeFileSync(join(outputDir, "report.json"), JSON.stringify({ source: { contacts: basename(contactsPath), sanity: basename(sanityPath) }, counts: { legacy_contacts: rows.length, leads: leads.length, subscribers: subscribers.length, sanity_documents: sanityDocuments.length }, generated_at: new Date().toISOString() }, null, 2));
console.log(`Prepared ${leads.length} leads, ${subscribers.length} subscribers and ${sanityDocuments.length} Sanity documents in ${outputDir}.`);
