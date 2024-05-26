export default function formatRemainingTime(endTime: string): string {
  const remainingTime = new Date(endTime).getTime() - new Date().getTime();
  if (remainingTime < 0) {
    return "00:00:00";
  }
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  if (days >= 1) {
    return `${days} Days`;
  }
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  return (
    `${hours < 10 ? "0" + hours : hours}:` +
    `${minutes < 10 ? "0" + minutes : minutes}:` +
    `${seconds < 10 ? "0" + seconds : seconds}`
  );
}
