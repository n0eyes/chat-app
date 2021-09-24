import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from "../../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/user_action";
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorFromSubmit, setErrorFromSubmit] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      if (!isLoading) {
        setIsLoading(true);
        const loginUser = await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(async () => {
            return await firebase
              .auth()
              .signInWithEmailAndPassword(data.Email, data.Password);
          });
        setIsLoading(false);
        dispatch(setUser(loginUser.user));
        history.push("/");
      }
    } catch (err) {
      setErrorFromSubmit(err.message);
      setIsLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: "center" }}>
          <h1>Log In</h1>
        </div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register("Email", {
            required: true,
            maxLength: 20,
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors?.Email?.type === "required" && <p>필수 입력 항목입니다</p>}
        {errors?.Email?.type === "maxLength" && (
          <p>이메일은 최대 10글자 입니다</p>
        )}

        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register("Password", { required: true, maxLength: 15 })}
        />

        {errors?.Password?.type === "required" && <p>필수 입력 항목입니다</p>}
        {errors?.Password?.type === "maxLength" && (
          <p>비밀번호는 최대 10글자 입니다</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" value="submit" disabled={isLoading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to="/register">
          아직 아이디가 없으신가요?
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
