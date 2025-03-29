import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function Tooltip({ children, content, position = "top" }) {
  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded shadow-lg whitespace-nowrap
          ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""}
          ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""}
          ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
          ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""}
          invisible group-hover:visible`}
      >
        {content}
        <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45
          ${position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""}
          ${position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""}
          ${position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""}
          ${position === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""}`}
        />
      </motion.div>
    </div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"])
}; 