export const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="40"
    height="40"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    className="text-teal-500 dark:text-teal-400" // 👈 couleur dynamique
  >
    <g fill="currentColor"> {/* 👈 hérite de la couleur du texte */}
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M10 10.111V1l11 6v14H3V7l7 3.111zm2-5.742v8.82l-7-3.111V19h14V8.187L12 4.37z" />
    </g>
  </svg>
);
