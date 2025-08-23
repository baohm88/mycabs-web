import { useQuery } from "@tanstack/react-query";
import { getRatingSummary } from "../lib/riders";
import RatingStars from "./RatingStars";

export default function RatingSummary({ targetType, targetId }) {
    const { data } = useQuery({
        queryKey: ["ratingSummary", targetType, targetId],
        queryFn: () => getRatingSummary(targetType, targetId),
    });
    const avg = data?.average ?? data?.Average ?? 0;
    const count = data?.count ?? data?.Count ?? 0;
    return (
        <div className="small">
            <RatingStars value={avg} />{" "}
            <span className="ms-1">
                {avg?.toFixed?.(2) || avg} ({count})
            </span>
        </div>
    );
}
