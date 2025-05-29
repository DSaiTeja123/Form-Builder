// src/utils/exportExcel.js
import * as XLSX from "xlsx";

/** Build a map of response keys (step0_field0) to field labels */
export function getFieldLabelMap(form) {
  const map = {};
  form.steps.forEach((step, sIdx) => {
    step.fields.forEach((field, fIdx) => {
      const key = `step${sIdx}_field${fIdx}`;
      map[key] = field.config.label || key;
    });
  });
  return map;
}

/** Export responses as Excel, using field labels as column headers */
export function exportToExcel(responses, form, formName = "responses") {
  if (!responses.length) {
    alert("No responses yet for this form.");
    return;
  }
  const fieldLabelMap = getFieldLabelMap(form);

  // Map each response's keys to labels
  const labeledResponses = responses.map((resp) => {
    const obj = {};
    Object.keys(resp).forEach((key) => {
      obj[fieldLabelMap[key] || key] = resp[key];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(labeledResponses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
  XLSX.writeFile(workbook, `${formName}.xlsx`);
}
