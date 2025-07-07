// Test for Info-Response case with user's data
function extractProcessName(result) {
  // First, try to extract from Output.prompt (e.g., "PI-Agent-Auction-Process@aos-2.0.1[Inbox:3]>")
  if (result.Output?.prompt) {
    const prompt = result.Output.prompt
    // Extract the process name before the @ symbol
    const match = prompt.match(/^([^@]+)/)
    if (match) {
      return match[1]
    }
    return prompt
  }

  // Try to extract from Messages[0].Tags
  if (result.Messages && result.Messages.length > 0) {
    const firstMessage = result.Messages[0]
    if (firstMessage.Tags) {
      const tags = Array.isArray(firstMessage.Tags) 
        ? firstMessage.Tags.reduce((acc, t) => {
            acc[t.name] = t.value
            return acc
          }, {})
        : firstMessage.Tags

      // Try different tag fields in order of preference
      const name = tags["Agent-Type"] || tags["Name"] || tags["Ticker"]
      if (name) {
        return name
      }
    }

    // Try to extract from Messages[0].Data if it's an object
    if (firstMessage.Data && typeof firstMessage.Data === "object") {
      const data = firstMessage.Data
      const name = data["Agent-Type"] || data["Name"] || data["Ticker"]
      if (name) {
        return name
      }
    }
  }

  return null
}

// Simulate the renderSummary logic for Info-Response case
function renderSummary(item) {
  const firstMsg = item.response?.Messages?.[0] || {}
  const resTags = Array.isArray(firstMsg.Tags)
    ? firstMsg.Tags.reduce((acc, t) => {
        acc[t.name] = t.value
        return acc
      }, {})
    : {}

  // Try to extract process name from the response
  const processName = extractProcessName(item.response)

  // special Info-Response case
  if (resTags.Action === "Info-Response") {
    const name = processName || "Portfolio Agent"
    return `Info → ${name}`
  }

  return "Other case"
}

// Test with user's data
const testData = {
  "Messages": [
    {
      "Target": "1234",
      "Tags": [
        {
          "value": "ao",
          "name": "Data-Protocol"
        },
        {
          "value": "ao.TN.1",
          "name": "Variant"
        },
        {
          "value": "Message",
          "name": "Type"
        },
        {
          "value": "216",
          "name": "Reference"
        },
        {
          "value": "Info-Response",
          "name": "Action"
        },
        {
          "value": "100000000000",
          "name": "Dutch-Starting-Price"
        },
        {
          "value": "atlyT9ph8ex_TxDDkQ2fdbhVT62sLw6boJPdEr7UqJE",
          "name": "Dexi-Token-Process"
        },
        {
          "value": "CjYVV3sO6Pnr28SjTtrvCT7kjx02ItaatchaOwoyL2k",
          "name": "Auctioned-Asset-Id"
        },
        {
          "value": "Active",
          "name": "Status"
        },
        {
          "value": "q1aypD57W2L2mJiAN98gwKRWt6R8WU0waFFjDUPB00A",
          "name": "Auction-Factory"
        },
        {
          "value": "1751867090738",
          "name": "Ends-At-Timestamp"
        },
        {
          "value": "64000000000",
          "name": "Dutch-Latest-Price-Broadcast"
        },
        {
          "value": "64000000000",
          "name": "Dutch-Current-Price"
        },
        {
          "value": "24",
          "name": "Dutch-Tick-Count"
        },
        {
          "value": "1751859890738",
          "name": "Starts-At-Timestamp"
        },
        {
          "value": "UNjNaSFkjRH5hGOvQ7YCYVu_q7HLwjtv0d50Bp9vGNo",
          "name": "Dexi-Process"
        },
        {
          "value": "60",
          "name": "Dutch-Total-Ticks"
        },
        {
          "value": "Dutch",
          "name": "Auction-Type"
        },
        {
          "value": "mockAO",
          "name": "Auctioned-Asset-Ticker"
        },
        {
          "value": "true",
          "name": "Initial-Patched"
        },
        {
          "value": "1500000000",
          "name": "Dutch-Decrement-Amount-Per-Tick"
        },
        {
          "value": "SzooQdJ_y0h9aRreZTIE5EGwkDuLvaR4qnjJztPumPo",
          "name": "Deployer"
        },
        {
          "value": "q1aypD57W2L2mJiAN98gwKRWt6R8WU0waFFjDUPB00A",
          "name": "Owner"
        },
        {
          "value": "10000000000",
          "name": "Dutch-Min-Price"
        },
        {
          "value": "2",
          "name": "Dutch-Tick-Interval-Minutes"
        },
        {
          "value": "Permaweb-Index-Buy-Ar-79",
          "name": "Auction-Name"
        },
        {
          "value": "100000000000",
          "name": "Auctioned-Amount"
        },
        {
          "value": "120",
          "name": "Duration-Minutes"
        },
        {
          "value": "SdykGZN16NdQrbPyIJSipet6_c0pIjFFIRDXkJkZFK8",
          "name": "Payment-Asset-Id"
        },
        {
          "value": "MockWrappedAR",
          "name": "Payment-Asset-Ticker"
        }
      ],
      "Anchor": "00000000000000000000000000000216"
    }
  ],
  "Assignments": [],
  "Spawns": [],
  "Output": {
    "prompt": "PI-Agent-Auction-Process@aos-2.0.1[Inbox:3]> ",
    "print": true,
    "data": "Calculating current tick count\ncurrentTime: 1751862862956\nellapsedTime: 2972218\ntickInterval: 120000\ntick count: 24\nCalculating current price\nCalculating current tick count\ncurrentTime: 1751862862956\nellapsedTime: 2972218\ntickInterval: 120000\ntick count: 24"
  },
  "GasUsed": 0
}

const testItem = {
  response: testData
}

const result = renderSummary(testItem)
console.log("Render result:", result)
console.log("Expected: Info → PI-Agent-Auction-Process") 