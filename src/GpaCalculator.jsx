
import { useState } from "react";

const createSubject = () => ({
  id: crypto.randomUUID(),
  subject: "",
  creditHours: "",
  marks: "",
});

const createSemester = (number) => ({
  id: crypto.randomUUID(),
  number,
  subjects: [createSubject()],
});

function validateSubject(row) {
  const errors = {};

  if (!row.subject.trim()) {
    errors.subject = "Subject name is required.";
  }

  if (row.creditHours === "") {
    errors.creditHours = "Credit hours are required.";
  } else if (Number(row.creditHours) === 0) {
    errors.creditHours = "Credit hours cannot be zero.";
  } else if (Number(row.creditHours) < 0) {
    errors.creditHours = "Credit hours cannot be negative.";
  } else if (!["3", "4"].includes(row.creditHours)) {
    errors.creditHours = "Enter either 3 or 4 credit hours.";
  }

  if (row.marks === "") {
    errors.marks = "Marks are required.";
  } else if (Number(row.marks) === 0) {
    errors.marks = "Marks cannot be zero.";
  } else if (Number(row.marks) < 0) {
    errors.marks = "Marks cannot be negative.";
  } else if (Number(row.marks) > 100) {
    errors.marks = "Marks cannot exceed 100.";
  }

  return errors;
}

function getQualityPoints(creditHours, marks) {
  if (
    creditHours === "" ||
    marks === "" ||
    !["3", "4"].includes(creditHours) ||
    Number(marks) < 0 ||
    Number(marks) > 100
  ) {
    return "";
  }

  const hours = Number(creditHours);
  const value = Number(marks);

  if (value < 50) return 0;
  if (value < 60) return hours;
  if (value < 70) return hours * 2;
  if (value < 80) return hours * 3;
  return hours * 4;
}

function getSubjectGrade(marks) {
  if (marks === "" || Number(marks) < 0 || Number(marks) > 100) {
    return "";
  }

  const value = Number(marks);

  if (value < 50) return "F";
  if (value < 60) return "D";
  if (value < 70) return "C";
  if (value < 80) return "B";
  return "A";
}

function getGpaGrade(gpa) {
  if (gpa >= 3.8) return "A";
  if (gpa >= 3) return "B";
  if (gpa >= 2) return "C";
  if (gpa >= 1) return "D";
  return "F";
}

const inputBase =
  "w-full min-w-0 rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2";

function GpaCalculator() {
  const [semesters, setSemesters] = useState(() => [
    createSemester(1),
  ]);

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState({});

  const updateSubject = (semesterId, subjectId, field, value) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id !== semesterId
          ? semester
          : {
              ...semester,
              subjects: semester.subjects.map((row) =>
                row.id === subjectId
                  ? { ...row, [field]: value }
                  : row
              ),
            }
      )
    );
  };

  const touchField = (subjectId, field) => {
    setTouched((current) => ({
      ...current,
      [`${subjectId}-${field}`]: true,
    }));
  };

  const addSubject = (semester) => {
    setSubmitted((current) => ({
      ...current,
      [semester.id]: true,
    }));

    const allValid = semester.subjects.every(
      (row) => Object.keys(validateSubject(row)).length === 0
    );

    if (!allValid) return;

    setSemesters((current) =>
      current.map((item) =>
        item.id === semester.id
          ? {
              ...item,
              subjects: [...item.subjects, createSubject()],
            }
          : item
      )
    );

    setSubmitted((current) => ({
      ...current,
      [semester.id]: false,
    }));
  };

  const removeSubject = (semesterId, subjectId) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id !== semesterId ||
        semester.subjects.length === 1
          ? semester
          : {
              ...semester,
              subjects: semester.subjects.filter(
                (row) => row.id !== subjectId
              ),
            }
      )
    );

    setTouched((current) =>
      Object.fromEntries(
        Object.entries(current).filter(
          ([key]) => !key.startsWith(`${subjectId}-`)
        )
      )
    );
  };

  const addSemester = () => {
    if (semesters.length >= 8) return;

    setSemesters((current) => [
      ...current,
      createSemester(current.length + 1),
    ]);
  };

  const removeSemester = (semesterId) => {
    setSemesters((current) =>
      current
        .filter((semester) => semester.id !== semesterId)
        .map((semester, index) => ({
          ...semester,
          number: index + 1,
        }))
    );

    setSubmitted((current) => {
      const next = { ...current };
      delete next[semesterId];
      return next;
    });
  };

  const getSemesterStats = (semester) => {
    const totalCreditHours = semester.subjects.reduce(
      (total, row) =>
        total +
        (["3", "4"].includes(row.creditHours)
          ? Number(row.creditHours)
          : 0),
      0
    );

    const totalQualityPoints = semester.subjects.reduce(
      (total, row) => {
        const qp = getQualityPoints(row.creditHours, row.marks);
        return total + (qp === "" ? 0 : qp);
      },
      0
    );

    const isValid = semester.subjects.every(
      (row) => Object.keys(validateSubject(row)).length === 0
    );

    const gpa =
      isValid && totalCreditHours > 0
        ? totalQualityPoints / totalCreditHours
        : null;

    return {
      totalCreditHours,
      totalQualityPoints,
      isValid,
      gpa,
    };
  };

  const allSemestersValid = semesters.every((semester) => {
    const stats = getSemesterStats(semester);
    return stats.isValid && stats.totalCreditHours > 0;
  });

  const totalCreditHours = semesters.reduce(
    (total, semester) =>
      total + getSemesterStats(semester).totalCreditHours,
    0
  );

  // Use each semester's unrounded GPA for the weighted calculation.
  const weightedGpaTotal = semesters.reduce((total, semester) => {
    const stats = getSemesterStats(semester);

    if (stats.gpa === null) return total;

    return total + stats.gpa * stats.totalCreditHours;
  }, 0);

  const cgpa =
    allSemestersValid && totalCreditHours > 0
      ? weightedGpaTotal / totalCreditHours
      : null;

  const getError = (row, field, semesterId) => {
    const errors = validateSubject(row);
    const key = `${row.id}-${field}`;

    return submitted[semesterId] || touched[key]
      ? errors[field]
      : "";
  };

  const fieldClass = (row, field, semesterId) =>
    `${inputBase} ${
      getError(row, field, semesterId)
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 text-gray-800">
      {/* Semester-wise tables */}
      {semesters.map((semester) => {
        const stats = getSemesterStats(semester);

        return (
          <div
            key={semester.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Semester heading */}
            <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Semester {semester.number}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add subjects and calculate your semester GPA.
                </p>
              </div>

              {semesters.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSemester(semester.id)}
                  className="self-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:self-auto"
                >
                  Remove Semester
                </button>
              )}
            </div>

            {/* Independent subject table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Credit Hours</th>
                    <th className="px-5 py-4">Marks</th>
                    <th className="px-5 py-4">Quality Points</th>
                    <th className="px-5 py-4">Grade</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {semester.subjects.map((row, index) => {
                    const qp = getQualityPoints(
                      row.creditHours,
                      row.marks
                    );
                    const grade = getSubjectGrade(row.marks);

                    return (
                      <tr key={row.id} className="align-top">
                        <td className="w-64 px-5 py-4">
                          <input
                            type="text"
                            value={row.subject}
                            onChange={(e) =>
                              updateSubject(
                                semester.id,
                                row.id,
                                "subject",
                                e.target.value
                              )
                            }
                            onBlur={() =>
                              touchField(row.id, "subject")
                            }
                            placeholder="e.g. Mathematics"
                            aria-label={`Semester ${semester.number}, subject ${index + 1}`}
                            aria-invalid={Boolean(
                              getError(row, "subject", semester.id)
                            )}
                            className={fieldClass(
                              row,
                              "subject",
                              semester.id
                            )}
                          />

                          {getError(row, "subject", semester.id) && (
                            <p className="mt-1.5 text-xs text-red-600">
                              {getError(row, "subject", semester.id)}
                            </p>
                          )}
                        </td>

                        <td className="w-40 px-5 py-4">
                          <input
                            type="number"
                            min="3"
                            max="4"
                            step="1"
                            value={row.creditHours}
                            onChange={(e) =>
                              updateSubject(
                                semester.id,
                                row.id,
                                "creditHours",
                                e.target.value
                              )
                            }
                            onBlur={() =>
                              touchField(row.id, "creditHours")
                            }
                            placeholder="3 or 4"
                            aria-label={`Semester ${semester.number}, credit hours for subject ${index + 1}`}
                            aria-invalid={Boolean(
                              getError(row, "creditHours", semester.id)
                            )}
                            className={fieldClass(
                              row,
                              "creditHours",
                              semester.id
                            )}
                          />

                          {getError(row, "creditHours", semester.id) && (
                            <p className="mt-1.5 text-xs text-red-600">
                              {getError(row, "creditHours", semester.id)}
                            </p>
                          )}
                        </td>

                        <td className="w-36 px-5 py-4">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            step="1"
                            value={row.marks}
                            onChange={(e) =>
                              updateSubject(
                                semester.id,
                                row.id,
                                "marks",
                                e.target.value
                              )
                            }
                            onBlur={() => touchField(row.id, "marks")}
                            placeholder="1–100"
                            aria-label={`Semester ${semester.number}, marks for subject ${index + 1}`}
                            aria-invalid={Boolean(
                              getError(row, "marks", semester.id)
                            )}
                            className={fieldClass(
                              row,
                              "marks",
                              semester.id
                            )}
                          />

                          {getError(row, "marks", semester.id) && (
                            <p className="mt-1.5 text-xs text-red-600">
                              {getError(row, "marks", semester.id)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex h-10 items-center">
                            <span className="inline-flex min-w-12 justify-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                              {qp === "" ? "—" : qp}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex h-10 items-center">
                            <span
                              className={`inline-flex min-w-10 justify-center rounded-lg px-3 py-2 text-sm font-bold ${
                                grade === "F"
                                  ? "bg-red-50 text-red-600"
                                  : grade
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {grade || "—"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(semester.id, row.id)
                            }
                            disabled={semester.subjects.length === 1}
                            aria-label={`Remove subject ${index + 1} from semester ${semester.number}`}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add subject to this semester only */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-gray-500">
                {semester.subjects.length}{" "}
                {semester.subjects.length === 1 ? "subject" : "subjects"}
              </p>

              <button
                type="button"
                onClick={() => addSubject(semester)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="text-lg leading-none">+</span>
                Add Subject
              </button>
            </div>

            {/* This semester's independent GPA summary */}
            <div className="border-t border-gray-200 px-5 py-5 sm:px-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Semester {semester.number} GPA
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Total Credit Hours
                  </p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {stats.totalCreditHours}
                  </p>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
                  <p className="text-sm font-medium text-indigo-700">
                    Obtained GPA
                  </p>
                  <p className="mt-3 text-3xl font-bold tabular-nums text-indigo-700">
                    {stats.gpa === null
                      ? "—"
                      : stats.gpa.toFixed(2)}
                    <span className="ml-1 text-base font-medium text-indigo-400">
                      / 4.00
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm font-medium text-gray-500">
                    GPA Grade
                  </p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {stats.gpa === null
                      ? "—"
                      : getGpaGrade(stats.gpa)}
                  </p>
                </div>
              </div>

              {!stats.isValid && (
                <p className="mt-4 text-sm text-gray-500">
                  Complete this semester's subject details to calculate its GPA.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Add semester control */}
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold text-gray-900">
            Add another semester
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {semesters.length} of 8 semesters added.
          </p>
        </div>

        <button
          type="button"
          onClick={addSemester}
          disabled={semesters.length >= 8}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="text-lg leading-none">+</span>
          {semesters.length >= 8
            ? "All 8 Semesters Added"
            : `Add Semester ${semesters.length + 1}`}
        </button>
      </div>

      {/* Final cumulative GPA summary */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Cumulative GPA (CGPA)
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your combined academic performance across all added semesters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-500">
              Total Credit Hours
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalCreditHours}
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
            <p className="text-sm font-medium text-indigo-700">
              Obtained CGPA
            </p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-indigo-700">
              {cgpa === null ? "—" : cgpa.toFixed(2)}
              <span className="ml-1 text-base font-medium text-indigo-400">
                / 4.00
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-500">
              CGPA Grade
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {cgpa === null ? "—" : getGpaGrade(cgpa)}
            </p>
          </div>
        </div>

        {!allSemestersValid && (
          <p className="px-5 pb-5 text-sm text-gray-500 sm:px-6">
            Complete all added semesters with valid subject details to calculate your CGPA.
          </p>
        )}
      </div>
    </section>
  );
}

export default GpaCalculator;

