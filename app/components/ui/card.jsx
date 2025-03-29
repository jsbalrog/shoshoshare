import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
);

Card.displayName = "Card";

Card.propTypes = {
  className: PropTypes.string,
};

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);

CardHeader.displayName = "CardHeader";

CardHeader.propTypes = {
  className: PropTypes.string,
};

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {props.children || ""}
  </h3>
);

CardTitle.displayName = "CardTitle";

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

const CardDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
);

CardDescription.displayName = "CardDescription";

CardDescription.propTypes = {
  className: PropTypes.string,
};

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

CardContent.displayName = "CardContent";

CardContent.propTypes = {
  className: PropTypes.string,
};

const CardFooter = ({ className, ...props }) => (
  <div
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);

CardFooter.displayName = "CardFooter";

CardFooter.propTypes = {
  className: PropTypes.string,
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 