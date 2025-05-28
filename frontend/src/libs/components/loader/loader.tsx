import { FC } from "react";
import "./loader.scss";

const Loader: FC = () => {
  return (
    <div className="loader">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
};

export { Loader };
