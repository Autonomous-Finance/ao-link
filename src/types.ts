// { created_date: '2024-02-21', num_messages: 69076 }
export type MessageStatistic = {
  created_date: string
  num_messages: number
}

// { created_date: '2024-01-24', modules_running: 83, delta: 15 }
export type ModuleStatistic = {
  created_date: string
  modules_running: number
  delta: number
}

// { created_date: '2024-01-24',  users: 21,  pct_change: -0.2222222222222222 }
export type UserStatistic = {
  created_date: string
  users: number
  pct_change: number
}

// { created_date: '2024-01-27', processes: 129, pct_change: 1.015625 },
export type ProcessStatistic = {
  created_date: string
  processes: number
  pct_change: number
}

export type HighchartAreaDataServer = [string, number]
export type HighchartAreaData = [number, number]
export type HighchartPieData = { y: number; name: string }

export const MSG_TYPES = ["Message", "Process", "Checkpoint", "Assignment"] as const

export type AoMessage = {
  id: string
  type: (typeof MSG_TYPES)[number]
  to: string
  from: string
  blockHeight: number | null
  schedulerId: string
  created: Date | null
  action: string
  tags: Record<string, string>
  systemTags: Record<string, string>
  userTags: Record<string, string>
  cursor?: string
}

export type TokenTransferMessage = {
  id: string
  type: "Message"
  created: Date
  action: string
  sender: string
  recipient: string
  amount: number
  tokenId: string
}
