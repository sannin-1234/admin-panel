function WavyLines() {
  return (
    <svg
      viewBox="0 0 60 40"
      width="40"
      height="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 10 Q 20 5, 30 10 Q 40 15, 50 10"
        fill="none"
        stroke="#F5CC4F"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <path
        d="M10 20 Q 20 15, 30 20 Q 40 25, 50 20"
        fill="none"
        stroke="#F5CC4F"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <path
        d="M10 30 Q 20 25, 30 30 Q 40 35, 50 30"
        fill="none"
        stroke="#F5CC4F"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

export default WavyLines;
