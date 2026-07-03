export default function TulipDivider({ animate }) {
	return (
		<svg
			className={`tulip-divider${animate ? ' draw' : ''}`}
			viewBox="0 0 260 44"
			aria-hidden="true"
		>
			<g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
				<path pathLength="1" d="M6 32 C 44 34 80 34 117 32" />
				<path pathLength="1" d="M254 32 C 216 34 180 34 143 32" />
				<path pathLength="1" d="M50 32 C 55 23 63 18 73 18" />
				<path pathLength="1" d="M210 32 C 205 23 197 18 187 18" />
				<path pathLength="1" d="M118 32 C 113 20 118 10 130 10 C 142 10 147 20 142 32" />
				<path pathLength="1" d="M119 26 C 110 24 105 18 105 11" />
				<path pathLength="1" d="M141 26 C 150 24 155 18 155 11" />
				<path pathLength="1" className="tulip-heart" d="M130 14 C 129 20 129 26 130 32" />
			</g>
			<circle cx="34" cy="25" r="3" fill="var(--paprika)" />
			<circle cx="90" cy="25" r="3" fill="var(--paprika)" />
			<circle cx="170" cy="25" r="3" fill="var(--paprika)" />
			<circle cx="226" cy="25" r="3" fill="var(--paprika)" />
		</svg>
	);
}
