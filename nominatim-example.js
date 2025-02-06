import fetch from "node-fetch"

async function searchLocation(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching locations:", error)
    return []
  }
}

// Example usage
const query = "Hanoi, Vietnam"
console.log(`Searching for: ${query}`)

const results = await searchLocation(query)
console.log("Search results:")
results.forEach((result, index) => {
  console.log(`${index + 1}. ${result.display_name} (Lat: ${result.lat}, Lon: ${result.lon})`)
})

