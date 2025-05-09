// import { v1 as uuidv4 } from "uuid"

function uuid4() {
  let array = new Uint8Array(16)
  crypto.getRandomValues(array)

  // Manipulate the 9th byte
  array[8] &= 0b00111111 // Clear the first two bits
  array[8] |= 0b10000000 // Set the first two bits to 10

  // Manipulate the 7th byte
  array[6] &= 0b00001111 // Clear the first four bits
  array[6] |= 0b01000000 // Set the first four bits to 0100

  const pattern = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
  let idx = 0

  return pattern.replace(
    /XX/g,
    () => array[idx++].toString(16).padStart(2, "0"), // padStart ensures a leading zero, if needed
  )
}

export const generateUUID = (): string => {
  return uuid4()
}

