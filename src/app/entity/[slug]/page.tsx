import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { getMessageById } from "@/services/messages-api"

import { AoMessage } from "@/types"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"

export default function EntityPage() {
  const { entityId } = useParams()

  const [message, setMessage] = useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!entityId) return

    getMessageById(entityId).then(setMessage)
  }, [entityId])

  if (!entityId) {
    return <div>Not Found</div>
  }

  if (!message) {
    return <UserPage entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage message={message} />
  }

  // return redirect(`/message/${entityId}`) // FIXME
  return null
}
