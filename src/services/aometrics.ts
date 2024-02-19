"use server"

import { supabase } from "@/lib/supabase"
//@ts-ignore
const normalize = (data) => {
  let count = 0
  //@ts-ignore
  const mapedData = data?.map((i) => {
    const data = {
      value: 0,
      date: "",
    }
    if ("num_messages" in i) {
      data.value = i.num_messages
      data.date = i.created_date
      count += i.num_messages
    } else if ("modules_running" in i) {
      data.value = i.modules_running
      data.date = i.created_date
      count += i.modules_running
    } else if ("users" in i) {
      data.value = i.users
      data.date = i.created_date
      count += i.users
    } else if ("processes" in i) {
      data.value = i.processes
      data.date = i.created_date
      count += i.processes
    }
    return data
  })

  getLatestModulesRunning(data)
  return {
    data: mapedData,
    count,
    latest: getLatestModulesRunning(data),
  }
}

// @ts-ignore
function getLatestModulesRunning(data) {
  // Sort the data based on the 'created_date' in descending order
  const sortedData = data.sort(
    // @ts-ignore
    (a, b) => new Date(b.created_date) - new Date(a.created_date),
  )
  if (data[0].modules_running) {
    return sortedData[0].modules_running
  }

  if (data[0].users) {
    return sortedData[0].users
  }

  if (data[0].processes) {
    return sortedData[0].processes
  }
}

export const metricsMessages = async (): Promise<any> => {
  try {
    const { data } = await supabase
      .from("ao_metrics_messages")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)

    if (data) {
      return normalize(data)
    }

    return null
  } catch (error) {
    return null
  }
}

export const metricsModules = async (): Promise<any> => {
  try {
    const { data } = await supabase
      .from("ao_metrics_modules")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)

    if (data) {
      return normalize(data)
    }

    return null
  } catch (error) {
    return null
  }
}

export const metricsUsers = async (): Promise<any> => {
  try {
    const { data } = await supabase
      .from("ao_metrics_users")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)

    if (data) {
      return normalize(data)
    }

    return null
  } catch (error) {
    return null
  }
}

export const metricsProcesses = async (): Promise<any> => {
  try {
    const { data } = await supabase
      .from("ao_metrics_processes ")
      .select("*")
      .order("created_date", { ascending: false })
      .limit(30)

    if (data) {
      return normalize(data)
    }

    return null
  } catch (error) {
    return null
  }
}
