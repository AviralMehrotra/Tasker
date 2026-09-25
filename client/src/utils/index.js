export const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export function dateFormatter(dateString) {
  if (!dateString) return "";
  const inputDate = new Date(dateString);
  if (isNaN(inputDate.getTime())) {
    return "";
  }
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") return "U";
  const names = fullName.trim().split(/\s+/);
  if (names.length === 0 || !names[0]) return "U";
  const initials = names
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() || "");
  return initials.join("") || "U";
}

