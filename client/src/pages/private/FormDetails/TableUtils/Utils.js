export const getUniqueOptions = (data, keyPath) => {
  if (!Array.isArray(data) || !keyPath) return [];

  const keys = keyPath.split("."); // supports nested keys (e.g., "doctor.name")

  const values = data
    .map((item) => {
      let value = item;
      for (const key of keys) value = value?.[key];
      return value;
    })
    .filter(Boolean);

  const unique = [...new Set(values)];
  return unique.map((v) => ({ value: v, label: v }));
};
