import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./Panel.scss";

const closeIcon = <FontAwesomeIcon icon={faClose} size="sm" color="white" />;

/**
 * A component that displays a panel with a header, title, and content.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to display inside the panel.
 * @param {string} props.id - The ID of the panel.
 * @param {string} props.size - The size of the panel ('sm', 'md', 'lg').
 * @param {boolean} props.closable - Whether the panel can be closed by the user.
 * @param {boolean} props.fixedHeight - Whether the panel has a fixed height.
 */
const Panel = ({ children, id, size, closable, fixedHeight }) => {
  return (
    <div
      id={id}
      className={`app-panel ${size} ${fixedHeight && "fixed-height"}`}
    >
      <header>
        {closable && <button className="close-btn">{closeIcon}</button>}
      </header>
      <div className="app-panel-content app-scroll">{children}</div>
    </div>
  );
};

export default Panel;
