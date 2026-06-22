import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { escapeHtml } from "../shared/utils/escapeHtml";
import type { Report } from "../types/report";

function e(value: string | undefined | null): string {
  return escapeHtml(value ?? "");
}

function buildHtml(report: Report): string {
  const checksHtml = report.checks
    ? report.checks
        .map((c) => {
          const color = c.tone === "ok" ? "#4DB95C" : c.tone === "bad" ? "#DB4431" : "#6B757C";
          return `<li style="color:${color};margin-bottom:4px;">&#9679; ${e(c.label)}</li>`;
        })
        .join("")
    : "";

  const ptsHtml = report.ptsData
    ? report.ptsData
        .map(
          (row) =>
            `<tr><td style="color:#666;padding:4px 8px 4px 0;">${e(row.label)}</td><td style="font-weight:600;padding:4px 0;">${e(row.value)}</td></tr>`,
        )
        .join("")
    : "";

  const penaltiesHtml = report.penalties?.length
    ? report.penalties
        .map(
          (p) => `
          <div style="border:1px solid #eee;border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="font-weight:700;color:#DB4431;">${e(p.amountText)}</div>
            <div style="font-size:12px;color:#666;">${e(p.dateText)}</div>
            <div style="font-size:12px;margin-top:4px;">${e(p.descriptionText)}</div>
          </div>`,
        )
        .join("")
    : "<p style='color:#666;font-size:12px;'>Штрафов не обнаружено</p>";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; margin: 0; padding: 24px; color: #1E1E1E; }
    h1 { font-size: 22px; font-weight: 900; margin: 0 0 4px; }
    h2 { font-size: 16px; font-weight: 700; margin: 24px 0 10px; border-bottom: 2px solid #DB4431; padding-bottom: 6px; color: #DB4431; }
    .header { background: #f7f7f7; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .price { font-size: 24px; font-weight: 900; color: #1E1E1E; margin: 8px 0 2px; }
    .credit { font-size: 13px; color: #666; margin-bottom: 10px; }
    .meta { font-size: 12px; color: #6B757C; }
    .checks { list-style: none; padding: 0; margin: 10px 0 0; }
    table { width: 100%; border-collapse: collapse; }
    .section { margin-bottom: 20px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .badge-ok { background: #EAF7EE; color: #4DB95C; }
    .badge-bad { background: #FFF1F3; color: #DB4431; }
    .footer { margin-top: 32px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="meta">${e(report.subtitle)} &nbsp;|&nbsp; ${e(report.bodyTypeText)} &nbsp;|&nbsp; ${e(report.yearText)}</div>
    <h1>${e(report.title)}</h1>
    <div class="price">${e(report.price)}</div>
    ${report.creditText ? `<div class="credit">${e(report.creditText)}</div>` : ""}
    ${report.city ? `<div class="meta">📍 ${e(report.city)}</div>` : ""}
    ${checksHtml ? `<ul class="checks">${checksHtml}</ul>` : ""}
  </div>

  ${ptsHtml ? `<div class="section"><h2>Данные ПТС</h2><table>${ptsHtml}</table></div>` : ""}

  <div class="section">
    <h2>Пробег</h2>
    <p style="font-size:16px;font-weight:700;">${e(report.mileageText)}</p>
  </div>

  <div class="section">
    <h2>Владельцы</h2>
    <table>
      <tr><td style="color:#666;padding:4px 8px 4px 0;">${e(report.owners.jur.title)}</td><td style="font-weight:600;">${e(report.owners.jur.value)}</td></tr>
      <tr><td style="color:#666;padding:4px 8px 4px 0;">${e(report.owners.phys.title)}</td><td style="font-weight:600;">${e(report.owners.phys.value)}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Юридическая чистота</h2>
    <span class="badge ${report.legalCleanliness.badgeText.toLowerCase().includes("чист") ? "badge-ok" : "badge-bad"}">${e(report.legalCleanliness.badgeText)}</span>
    <ul style="margin-top:10px;padding-left:18px;">
      ${report.legalCleanliness.items.map((i) => `<li style="color:${i.tone === "ok" ? "#4DB95C" : "#DB4431"};margin-bottom:4px;">${e(i.text)}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h2>Коммерческое использование</h2>
    <span class="badge ${report.commercialUsage.badgeText.toLowerCase().includes("не") ? "badge-ok" : "badge-bad"}">${e(report.commercialUsage.badgeText)}</span>
    <ul style="margin-top:10px;padding-left:18px;">
      ${report.commercialUsage.items.map((i) => `<li style="color:${i.tone === "ok" ? "#4DB95C" : "#DB4431"};margin-bottom:4px;">${e(i.text)}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h2>Штрафы</h2>
    ${penaltiesHtml}
  </div>

  <div class="section">
    <h2>Оценка стоимости</h2>
    <p style="font-size:14px;">${e(report.costEstimation.text)}</p>
    <p style="font-size:16px;font-weight:700;">${e(report.costEstimation.rangeText)}</p>
  </div>

  <div class="footer">
    Отчёт сформирован сервисом INDEP &bull; ${new Date().toLocaleDateString("ru-RU")}
  </div>
</body>
</html>`;
}

/** @internal Exported for unit tests. */
export function buildReportPdfHtml(report: Report): string {
  return buildHtml(report);
}

export async function downloadReportPdf(report: Report): Promise<void> {
  const html = buildHtml(report);
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error("Sharing недоступен на этом устройстве.");
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: `Отчёт — ${report.title}`,
    UTI: "com.adobe.pdf",
  });
}
