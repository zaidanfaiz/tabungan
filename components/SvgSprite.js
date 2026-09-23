export default function SvgSprite() {
  return (
    <svg className="sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        <linearGradient id="gScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBDCC8" />
          <stop offset=".55" stopColor="#EFE2F4" />
          <stop offset="1" stopColor="#F7CBD0" />
        </linearGradient>
        <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2E0BE" />
          <stop offset=".5" stopColor="#DCB983" />
          <stop offset="1" stopColor="#EBCFA4" />
        </linearGradient>
      </defs>

      <symbol id="d-heart" viewBox="0 0 24 24">
        <path
          d="M12 20.5c-4.8-3.4-8.4-6.5-8.4-10.2A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8.4 2.9c0 3.7-3.6 6.8-8.4 10.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </symbol>

      <symbol id="d-heart-f" viewBox="0 0 24 24">
        <path
          d="M12 20.5c-4.8-3.4-8.4-6.5-8.4-10.2A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8.4 2.9c0 3.7-3.6 6.8-8.4 10.2Z"
          fill="currentColor"
        />
      </symbol>

      <symbol id="d-spark" viewBox="0 0 24 24">
        <path d="M12 2Q13.2 10.8 22 12 13.2 13.2 12 22 10.8 13.2 2 12 10.8 10.8 12 2Z" fill="currentColor" />
      </symbol>

      <symbol id="d-star" viewBox="0 0 24 24">
        <path
          d="M12 3.4l2.5 5.3 5.8.7-4.3 4 1.2 5.7L12 16.3l-5.2 2.8 1.2-5.7-4.3-4 5.8-.7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </symbol>

      <symbol id="d-bow" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M11.8 11.8C8.4 7.4 3.6 6.6 3.1 9.5c-.4 2.6 3.3 4.3 8.7 2.6" />
          <path d="M12.2 11.8c3.4-4.4 8.2-5.2 8.7-2.3.4 2.6-3.3 4.3-8.7 2.6" />
          <path d="M11 13.4c-.7 2.3-1.7 3.9-3.1 5.3M13 13.4c.4 2.3 1.4 3.9 2.8 5.1" />
          <ellipse cx="12" cy="11.7" rx="1.7" ry="1.5" />
        </g>
      </symbol>

      <symbol id="d-flower" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="6.8" r="3" />
          <circle cx="16.2" cy="9.9" r="3" />
          <circle cx="14.5" cy="14.8" r="3" />
          <circle cx="9.5" cy="14.8" r="3" />
          <circle cx="7.8" cy="9.9" r="3" />
          <circle cx="12" cy="11.6" r="2" />
        </g>
      </symbol>

      <symbol id="d-flame" viewBox="0 0 24 24">
        <path
          d="M12.6 3.2c.4 3.5 4.6 4.9 4.6 9a5.1 5.1 0 0 1-10.2 0c0-2.2 1-3.6 2.2-4.8 0 1.6.9 2.5 2 2.5 1.3 0 1.9-1.2 1.7-3.1-.1-1.5-.3-2.6-.3-3.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </symbol>

      <symbol id="d-check" viewBox="0 0 24 24">
        <path
          d="M5 13.4c1.9 1.4 3.3 2.9 4.5 4.7C12.7 12.2 16.1 8 20 5.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </symbol>

      <symbol id="d-lock" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M8 11V8.9a4 4 0 0 1 8 0V11" />
          <rect x="6.3" y="11" width="11.4" height="8.6" rx="2.2" />
        </g>
      </symbol>

      <symbol id="d-home" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11.5 12 4.9l8 6.6" />
          <path d="M6.5 10v9.4h11V10" />
          <path d="M10.3 19.4v-4.9h3.4v4.9" />
        </g>
      </symbol>

      <symbol id="d-book" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 7.3c-2.1-.7-4.2-.8-6.4-.4v11.5c2.2-.4 4.3-.3 6.4.4 2.1-.7 4.2-.8 6.4-.4V6.9c-2.2-.4-4.3-.3-6.4.4Z" />
          <path d="M12 7.3v11.5" />
          <path d="M14.6 7.1v5.6l1.5-1.2 1.5 1.2V7.6" strokeWidth="1.4" />
        </g>
      </symbol>

      <symbol id="d-plus" viewBox="0 0 24 24">
        <path
          d="M12 5.6v12.8M5.6 12h12.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </symbol>

      <symbol id="d-arrow" viewBox="0 0 24 24">
        <path
          d="M4.5 12h13.4M12.6 6.6 18.4 12l-5.8 5.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </symbol>

      <symbol id="d-x" viewBox="0 0 24 24">
        <path
          d="M7 7.2 17 16.8M16.9 7.2 7.1 16.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </symbol>

      <symbol id="d-ipad" viewBox="0 0 72 54">
        <rect x="2" y="2" width="68" height="50" rx="5.5" fill="#3A302C" />
        <rect x="6" y="6" width="60" height="42" rx="2.5" fill="url(#gScreen)" />
        <path
          d="M14 34c4.5-9 9-13.5 13.5-13.5S36 25 40.5 34"
          fill="none"
          stroke="#fff"
          strokeOpacity=".45"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M46 15.5c-1.9-1.4-3.3-2.6-3.3-4a1.8 1.8 0 0 1 3.3-1 1.8 1.8 0 0 1 3.3 1c0 1.4-1.4 2.6-3.3 4Z"
          fill="#fff"
          fillOpacity=".7"
        />
        <circle cx="36" cy="4" r=".9" fill="#7A6E66" />
      </symbol>

      <symbol id="d-iphone" viewBox="0 0 44 68">
        <rect
          x="1.5"
          y="1.5"
          width="41"
          height="65"
          rx="10.5"
          fill="url(#gGold)"
          stroke="#B99B6C"
          strokeWidth="1.2"
        />
        <path
          d="M6 52c2 6 6 10 12 12"
          fill="none"
          stroke="#fff"
          strokeOpacity=".5"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="6" y="6" width="18" height="18" rx="5.5" fill="#E7CDA2" stroke="#C4A476" strokeWidth="1" />
        <circle cx="11.4" cy="11.4" r="3.4" fill="#463C36" />
        <circle cx="11.4" cy="11.4" r="1.3" fill="#948A82" />
        <circle cx="18.6" cy="11.4" r="3.4" fill="#463C36" />
        <circle cx="18.6" cy="11.4" r="1.3" fill="#948A82" />
        <circle cx="15" cy="18.4" r="3.4" fill="#463C36" />
        <circle cx="15" cy="18.4" r="1.3" fill="#948A82" />
        <circle cx="21.6" cy="18.6" r="1.6" fill="#F6E7C6" />
      </symbol>
    </svg>
  );
}
