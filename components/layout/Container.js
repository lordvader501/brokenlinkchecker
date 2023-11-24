import classNames from "classnames";

export function Container({ className, ...props }) {
  return (
    <div
      className={classNames(
        "mx-auto max-w-6xl px-4 sm:px-4 lg:px-8",
        className
      )}
      {...props}
    />
  );
}
