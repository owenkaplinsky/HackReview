// Utility functions for the application

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const getScoreColor = (
  score: number,
  maxScore: number = 100
): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 75) return "text-success-600";
  if (percentage >= 50) return "text-warning-600";
  return "text-danger-600";
};

export const getScoreBgColor = (
  score: number,
  maxScore: number = 100
): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 75) return "bg-success-100";
  if (percentage >= 50) return "bg-warning-100";
  return "bg-danger-100";
};

export const exportToCSV = (data: any[], filename: string): void => {
  const csvContent = [
    Object.keys(data[0]).join(","),
    ...data.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const downloadAsJSON = (data: any, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
