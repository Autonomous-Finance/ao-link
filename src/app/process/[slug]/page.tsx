import { getAoEventById, getLatestMessagesForProcess } from "@/services/aoscan"

import { ProcessPage } from "./ProcessPage"

type ProcessPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function ProcessPageServer(props: ProcessPageProps) {
  const { slug: processId } = props.params

  const event = await getAoEventById(processId)

  if (!event) {
    return <div>Not Found</div>
  }
  const messages = (await getLatestMessagesForProcess(processId)) || []

  return <ProcessPage event={event} messages={messages} />
}
