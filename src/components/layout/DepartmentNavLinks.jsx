import { Link } from "react-router-dom";
import { STORE_DEPARTMENTS, departmentBrowsePath } from "../../utils/catalogBrowse.js";

/** Compact department strip for navbar / footer. */
export default function DepartmentNavLinks({ className = "", onNavigate }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
      {STORE_DEPARTMENTS.map((d) => (
        <Link
          key={d.key}
          to={d.path || departmentBrowsePath(d.key)}
          onClick={onNavigate}
          className="text-sm text-white/50 transition hover:text-neon-cyan"
        >
          {d.label}
        </Link>
      ))}
      <Link to="/shops" onClick={onNavigate} className="text-sm text-white/50 transition hover:text-neon-cyan">
        Shops
      </Link>
    </div>
  );
}
