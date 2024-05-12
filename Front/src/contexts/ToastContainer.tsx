import { ToastContainer as BaseToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastContainer({ ...props }) {
  return <BaseToastContainer {...props} />;
}

export default ToastContainer;
