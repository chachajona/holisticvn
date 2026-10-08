import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

// Palette and radii mirror DESIGN.md. Email clients ignore CSS variables, so values are literal.
const color = {
  card: "#fdfaf6",
  ink: "#3a2a24",
  muted: "#5c4b44",
  clay: "#90776e",
  clayDeep: "#744d40",
  sage: "#48614c",
  numeral: "#ab917e",
  band: "#f6efe6",
  offWhite: "#f7f3f0",
  hairline: "rgba(58, 42, 36, 0.14)",
  paleOnSage: "#dcd1cd",
};
// Web fonts load in Apple Mail and iOS only; Gmail and Outlook fall back to Georgia and a system mono.
const font = {
  serif: "'Roboto Serif', Georgia, 'Times New Roman', serif",
  slab: "'Roboto Slab', Georgia, 'Times New Roman', serif",
  mono: "'Roboto Mono', 'SF Mono', Menlo, Consolas, monospace",
};
const label = {
  margin: 0,
  fontFamily: font.mono,
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
};

export type LeadEmailProps = {
  eyebrow: string;
  name: string | null;
  phone: string;
  tel: string;
  zalo: string;
  received: string;
  rows: [string, string][];
  note: string | null;
  emptyNote: string | null;
  logoUrl: string;
  logoOnDarkUrl: string;
  siteUrl: string;
};

export function LeadNotificationEmail({
  eyebrow,
  name,
  phone,
  tel,
  zalo,
  received,
  rows,
  note,
  emptyNote,
  logoUrl,
  logoOnDarkUrl,
  siteUrl,
}: LeadEmailProps) {
  const button = {
    display: "inline-block",
    margin: "0 8px 8px 0",
    padding: "13px 24px",
    borderRadius: "999px",
    fontFamily: font.serif,
    fontSize: "15px",
    fontWeight: 400,
    textDecoration: "none",
  };
  return (
    <Html lang="vi">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&family=Roboto+Serif:wght@300;400&family=Roboto+Slab:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{`${name ?? "Khách mới"} · ${phone} — gọi lại sớm nhất có thể`}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "32px 12px",
          backgroundColor: color.band,
          fontFamily: font.serif,
          color: color.ink,
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            backgroundColor: color.card,
            border: `1px solid ${color.hairline}`,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Section style={{ padding: "26px 32px 0" }}>
            <Row>
              <Column>
                <Img
                  src={logoUrl}
                  alt="holistic — rehab & performance"
                  height={34}
                  style={{ display: "block", height: "34px", width: "auto", border: 0 }}
                />
              </Column>
              <Column align="right">
                <Text
                  style={{
                    ...label,
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    backgroundColor: color.band,
                    color: color.clayDeep,
                  }}
                >
                  {received}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ padding: "36px 32px 0" }}>
            <Text style={{ ...label, color: color.clay }}>{eyebrow}</Text>
            <Text
              style={{
                margin: "10px 0 0",
                fontFamily: font.slab,
                fontSize: "32px",
                lineHeight: "1.15",
                fontWeight: 300,
                letterSpacing: "-0.015em",
                color: color.sage,
              }}
            >
              {name ?? phone}
            </Text>
            {name && (
              <Text
                style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 300, color: color.muted }}
              >
                {phone}
              </Text>
            )}
          </Section>

          <Section
            style={{
              padding: `24px 32px ${rows.length === 0 && (note ?? emptyNote) === null ? "36px" : "0"}`,
            }}
          >
            <Link
              href={`tel:${tel}`}
              style={{ ...button, backgroundColor: color.clayDeep, color: color.offWhite }}
            >
              Gọi {phone}
            </Link>
            <Link
              href={zalo}
              style={{
                ...button,
                border: `1px solid ${color.hairline}`,
                padding: "12px 24px",
                color: color.ink,
              }}
            >
              Nhắn Zalo
            </Link>
          </Section>

          {rows.length > 0 && (
            <Section
              style={{ padding: `20px 32px ${(note ?? emptyNote) === null ? "36px" : "0"}` }}
            >
              {rows.map(([key, value]) => (
                <Row key={key} style={{ borderTop: `1px solid ${color.hairline}` }}>
                  <Column style={{ width: "38%", padding: "13px 0", verticalAlign: "top" }}>
                    <Text style={{ ...label, color: color.clay, lineHeight: "1.6" }}>{key}</Text>
                  </Column>
                  <Column style={{ padding: "11px 0", verticalAlign: "top" }}>
                    <Text
                      style={{ margin: 0, fontSize: "15px", lineHeight: "1.5", color: color.ink }}
                    >
                      {value}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Hr style={{ margin: 0, borderColor: color.hairline }} />
            </Section>
          )}

          {(note ?? emptyNote) !== null && (
            <Section style={{ padding: "24px 32px 36px" }}>
              <div
                style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "22px 24px" }}
              >
                <Text style={{ ...label, color: color.clay }}>Ghi chú của khách</Text>
                <Text
                  style={{
                    margin: "10px 0 0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontWeight: 300,
                    whiteSpace: "pre-wrap",
                    color: note ? color.ink : color.muted,
                  }}
                >
                  {note ?? emptyNote}
                </Text>
              </div>
            </Section>
          )}

          <Section style={{ padding: "22px 32px", backgroundColor: color.sage }}>
            <Row>
              <Column>
                <Img
                  src={logoOnDarkUrl}
                  alt="holistic"
                  height={24}
                  style={{ display: "block", height: "24px", width: "auto", border: 0 }}
                />
              </Column>
              <Column align="right">
                {/* explicit link: Gmail otherwise auto-links the bare domain in its default blue */}
                <Text style={{ ...label, color: color.paleOnSage }}>
                  <Link href={siteUrl} style={{ color: color.paleOnSage, textDecoration: "none" }}>
                    holisticvn.com
                  </Link>
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;
