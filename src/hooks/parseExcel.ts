import * as XLSX from "xlsx";

export async function parseQuestionExcel(
  file: File,
  subjectId: string | number,
  subjectType: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const formatted = jsonData.map((row: any) => ({
          question: row.question_text,
          rendered_text: row.question_text,
          question_text: row.question_text,
          question_image: row.question_image || null,
          option_a: row.option_a,
          option_b: row.option_b,
          option_c: row.option_c,
          option_d: row.option_d,
          correct_option: String(row.correct_option).toLowerCase(),
          hint: row.hint || "",
          explanation: row.explanation || "",
          year: Number(row.year),
          topic: row.topic,
          status: 0,
          format: "text",
          type: subjectType,   // Injected dynamically
          subject: subjectId,  // Injected dynamically
        }));

        resolve(formatted);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
