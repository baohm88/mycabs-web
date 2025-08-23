export default function RatingStars({ value = 0 }) {
    const v = Math.round(Number(value) || 0);
    return (
        <span>
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>{i <= v ? "★" : "☆"}</span>
            ))}
        </span>
    );
}
