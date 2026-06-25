import type { Blueprint, BlueprintSection, ValidationError } from "../types/blueprints.types";

export function runBlueprintValidation(
  bp: Blueprint,
  sections: BlueprintSection[],
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!sections || sections.length === 0) {
    errors.push({
      type: "empty_blueprint",
      severity: "error",
      message: "Blueprint chưa có phần (section) nào.",
    });
    return errors;
  }

  for (const sec of sections) {
    const partSum = sec.parts.reduce((a, p) => a + (p.qCount || 0), 0);

    if (sec.questionTotal > 0 && partSum !== sec.questionTotal) {
      errors.push({
        type: "section_question_mismatch",
        severity: "error",
        sectionId: sec.id,
        message: `"${sec.name}": tổng câu hỏi các part (${partSum}) ≠ khai báo (${sec.questionTotal})`,
      });
    }

    if (!sec.skill) {
      errors.push({
        type: "missing_skill",
        severity: "warning",
        sectionId: sec.id,
        message: `"${sec.name}": chưa chọn kỹ năng (skill)`,
      });
    }

    for (const part of sec.parts) {
      if (!part.taskType) {
        errors.push({
          type: "missing_task_type",
          severity: "error",
          sectionId: sec.id,
          partId: part.id,
          message: `"${sec.name}" › "${part.name}": chưa chọn dạng bài (task type)`,
        });
      }

      if (!part.qCount || part.qCount <= 0) {
        errors.push({
          type: "zero_questions",
          severity: "warning",
          sectionId: sec.id,
          partId: part.id,
          message: `"${sec.name}" › "${part.name}": số câu hỏi = 0`,
        });
      }

      if (part.mediaRequired && (!part.mediaType || part.mediaType === "none")) {
        errors.push({
          type: "missing_media_type",
          severity: "warning",
          sectionId: sec.id,
          partId: part.id,
          message: `"${sec.name}" › "${part.name}": yêu cầu media nhưng chưa chọn loại`,
        });
      }
    }
  }

  const durationSum = sections.reduce((a, s) => a + (s.durationMin || 0), 0);
  if (bp.durationTotal > 0 && durationSum !== bp.durationTotal) {
    errors.push({
      type: "duration_total_mismatch",
      severity: "warning",
      message: `Tổng thời gian các phần (${durationSum} phút) ≠ khai báo blueprint (${bp.durationTotal} phút)`,
    });
  }

  return errors;
}
