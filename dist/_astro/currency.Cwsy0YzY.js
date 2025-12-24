function formatCurrency(amount, options) {
  const { withSymbol = true, compact = false, decimals = 0 } = {};
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (numAmount === void 0 || numAmount === null || isNaN(numAmount)) {
    return withSymbol ? "Rp 0" : "0";
  }
  if (compact) {
    const absAmount = Math.abs(numAmount);
    let formatted2;
    if (absAmount >= 1e12) {
      formatted2 = `${(numAmount / 1e12).toLocaleString("id-ID", { maximumFractionDigits: 1 })} T`;
    } else if (absAmount >= 1e9) {
      formatted2 = `${(numAmount / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
    } else if (absAmount >= 1e6) {
      formatted2 = `${(numAmount / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
    } else if (absAmount >= 1e3) {
      formatted2 = `${(numAmount / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 1 })} rb`;
    } else {
      formatted2 = numAmount.toLocaleString("id-ID");
    }
    return withSymbol ? `Rp ${formatted2}` : formatted2;
  }
  const formatted = numAmount.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return withSymbol ? `Rp ${formatted}` : formatted;
}
export {
  formatCurrency as f
};
