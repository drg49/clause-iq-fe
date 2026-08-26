import "./Form.scss";

/**
 * A form component that can be used to wrap form elements.
 *
 * @param {Object} props - The props object that contains the following:
 * @param {ReactNode} props.children - The child elements to be wrapped by the form.
 * @param {string} props.id - The ID attribute for the form.
 * @param {number} props.columns - The number of columns to display the form elements in (1, 2, 3).
 */
const Form = ({ children, id, columns }) => {
  return (
    <div id={id} className={`app-form ${columns || ""}`}>
      {children}
    </div>
  );
};

export default Form;
