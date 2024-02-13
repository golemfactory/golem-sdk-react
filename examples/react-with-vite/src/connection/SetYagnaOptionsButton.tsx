import { useState } from "react";
import SetYagnaOptionsDropdown from "./SetYagnaOptionsDropdown";

export default function SetYagnaOptionsButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex">
      <button className="btn btn-ghost" onClick={() => setIsDropdownOpen(true)}>
        Change yagna options
      </button>
      <div className="flex self-end">
        {isDropdownOpen && (
          <SetYagnaOptionsDropdown onClose={() => setIsDropdownOpen(false)} />
        )}
      </div>
    </div>
  );
}
