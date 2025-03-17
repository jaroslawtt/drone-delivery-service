import styles from "./styles.module.scss";

const SignInForm = () => {
  return (
    <div className={styles["form-wrapper"]}>
      <form>
        <input type="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export { SignInForm };
