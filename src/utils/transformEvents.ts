import { IAOEvents } from "@/services/aoscan";
import { getTimeMarginFromDate } from "./calcPeriod";
import { transformLongText } from "./transformLongText";

export function transformArrayElements(inputArray: IAOEvents[]): any {
  return inputArray.map((item) => {
    const {
      owner,
      id: messageId,
      tags_flat: { Type: type, Variant: schedulerId },
      height: blockHeight,
      created_at: created,
      target,
    } = item;

    return {
      type,
      messageId: messageId,
      owner: transformLongText(owner),
      nonce: 0, // Assuming nonce is a number, parse it to an integer
      processId: transformLongText(target),
      blockHeight,
      schedulerId,
      created: getTimeMarginFromDate(created),
    };
  });
}
