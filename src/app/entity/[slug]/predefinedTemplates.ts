export type Template = { id: string; name: string; payload: string }

export function getPredefinedTemplates(processId: string): Template[] {
  return [
    {
      id: 'predef-balance',
      name: 'Balance',
      payload: JSON.stringify({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Balance" },
          { name: "Recipient", value: "ADDRESS" },
        ],
      }, null, 2),
    },
    {
      id: 'predef-transfer',
      name: 'Transfer',
      payload: JSON.stringify({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Transfer" },
          { name: "Recipient", value: "RECEIVING_ADDRESS" },
          { name: "Quantity", value: "100000000000" },
        ],
      }, null, 2),
    },
  ]
} 
