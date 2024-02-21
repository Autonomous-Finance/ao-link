"use server"

import { supabase } from "@/lib/supabase"
import {
  HighchartAreaData,
  MessageStatistic,
  ModuleStatistic,
  ProcessStatistic,
  UserStatistic,
} from "@/types"

export async function getMessageStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_messages")
      .select("*")
      .order("created_date", { ascending: true })
      .returns<MessageStatistic[]>()

    if (data) {
      // derive cumulative data
      return data
        .reduce((acc, curr) => {
          const numMessages = acc.length
            ? acc[acc.length - 1][1] + curr.num_messages
            : curr.num_messages
          return [
            ...acc,
            [
              new Date(curr.created_date).getTime(),
              numMessages,
            ] as HighchartAreaData,
          ]
        }, [] as HighchartAreaData[])
        .slice(-30)
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getModuleStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_modules")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<ModuleStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.modules_running])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getUserStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_users")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<UserStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.users])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getProcessStats(): Promise<HighchartAreaData[]> {
  try {
    const { data } = await supabase
      .from("ao_metrics_processes ")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)
      .returns<ProcessStatistic[]>()

    if (data) {
      return data
        .reverse()
        .map((x) => [new Date(x.created_date).getTime(), x.processes])
    }

    return []
  } catch (error) {
    console.error(error)
    return []
  }
}
