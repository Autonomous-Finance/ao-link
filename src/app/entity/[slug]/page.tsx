import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"
import { getMessageById } from "@/services/messages-api"

import { AoMessage } from "@/types"

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
    return <UserPage key={entityId} entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage key={entityId} message={message} />
  }

  // return redirect(`/message/${entityId}`) // FIXME
  return null
}
