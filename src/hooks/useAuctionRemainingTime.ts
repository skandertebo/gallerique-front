import { useLayoutEffect, useState } from "react";
import AuctionSchema from "../api/auction/schemas/auction.schema";
import formatRemainingTime from "../utils/formatRemainingTime";

export interface AuctionRemainingTime {
  type: "finished" | "starts-at" | "ends-at";
  remainingTime: string;
}

export default function useAuctionRemainingTime(
  auction: AuctionSchema
): AuctionRemainingTime {
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [type, setType] = useState<AuctionRemainingTime["type"]>("ends-at");
  useLayoutEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (
      new Date(auction.startDate).getTime() > new Date().getTime() ||
      new Date(auction.endTime).getTime() > new Date().getTime()
    ) {
      interval = setInterval(() => {
        if (new Date(auction.endTime).getTime() < new Date().getTime()) {
          if (interval) clearInterval(interval);
        } else if (
          new Date(auction.startDate).getTime() > new Date().getTime()
        ) {
          setRemainingTime(formatRemainingTime(auction.startDate));
          setType("starts-at");
        } else {
          setRemainingTime(formatRemainingTime(auction.endTime));
          setType("ends-at");
        }
      }, 1000);
    } else {
      setType("finished");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auction]);

  return { type, remainingTime };
}
