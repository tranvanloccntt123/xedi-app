export function hidePhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters from the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Get the length of the number
  const length = cleanNumber.length;

  // If the number is 3 digits or less, return it as is
  if (length <= 3) {
    return cleanNumber;
  }

  // Create a mask of asterisks for all but the last 3 digits
  const mask = "*".repeat(length - 3);

  // Combine the mask with the last 3 digits
  return mask + cleanNumber.slice(-3);
}

export function splitLocation(address: string) {
  const _split = (address || "").split(",").map((v) => v.trim());
  if (_split.length < 3) {
    return {
      title: address,
      subTitle: "",
    };
  }
  return {
    title: _split[0],
    subTitle: _split.filter((_, i) => i !== 0).join(", "),
  };
}

export const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
