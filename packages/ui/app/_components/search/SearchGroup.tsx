import clsx from "clsx";

interface Props {
  groupClass?: string;
  buttonClass?: string;
  onClickPrepend?: React.MouseEventHandler<any>;
  onClickAppend?: React.MouseEventHandler<any>;
  prepend: React.ReactNode;
  input: React.ReactNode;
  append?: React.ReactNode;
}
/**
 * Our searcher is always part of a basic group
 * Also used as a template for titles on non search pages
 */
export default function SearchGroup(props: Props) {
  return (
    <div className={clsx(props.groupClass, "input-group")}>
      <div className="input-group-prepend">
        <button
          className={clsx("btn", props.buttonClass || "btn-light")}
          type="button"
          onClick={props.onClickPrepend}
        >
          {props.prepend}
        </button>
      </div>
      {props.input}
      {props.append && (
        <div className="input-group-append">
          <button
            className={clsx("btn", props.buttonClass || "btn-light")}
            type="button"
            onClick={props.onClickAppend}
          >
            {props.prepend}
          </button>
        </div>
      )}
    </div>
  );
}
