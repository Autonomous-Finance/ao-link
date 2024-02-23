import { getAoEventById } from "@/services/aoscan"

import { MessagePage } from "./MessagePage"

type MessagePageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function MessagePageServer(props: MessagePageServerProps) {
  const { slug: messageId } = props.params

  const event = await getAoEventById(messageId)

  if (!event) {
    return <div>Not Found</div>
  }

  let data = ""
  try {
    const dataResponse = await fetch(`https://arweave.net/${messageId}`)
    data = await dataResponse.text()
  } catch (error) {
    console.log("Arweave.net error:", error)
  }

  return <MessagePage event={event} data={data} />
}
