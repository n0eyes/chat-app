import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from "../../firebase";
import { useHistory } from "react-router";
import { v4 } from "uuid";
function RegisterPage() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const password = useRef();
  password.current = watch("Password");
  const [errorFromSubmit, setErrorFromSubmit] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const onSubmit = async (data) => {
    try {
      if (!isLoading) {
        setIsLoading(true);
        // <__firebase 유저 생성__>
        let createdUser = await firebase
          .auth()
          .createUserWithEmailAndPassword(data.Email, data.Password);
        setIsLoading(false);
        await createdUser.user.updateProfile({
          displayName: data.Name,
          photoURL: `http://gravatar.com/avatar/${v4()}?d=identicon`,
        });
        await firebase.database().ref("user").child(createdUser.user.uid).set({
          name: createdUser.user.displayName,
          image: createdUser.user.photoURL,
          friend: {},
        });
        // history.push("/login");
      }
    } catch (err) {
      setErrorFromSubmit(err.message);
      setIsLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 2000);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: "center" }}>
          <h1>Register</h1>
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
        <label>Name</label>
        <input
          name="name"
          {...register("Name", { required: true, maxLength: 10 })}
        />

        {errors?.Name?.type === "required" && <p>필수 입력 항목입니다</p>}
        {errors?.Name?.type === "maxLength" && <p>이름은 최대 10글자 입니다</p>}
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
        <label>Password-Confirm</label>
        <input
          name="passwordConfirm"
          type="password"
          {...register("PasswordConfirm", {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors?.PasswordConfirm?.type === "required" && (
          <p>필수 입력 항목입니다</p>
        )}
        {errors?.PasswordConfirm?.type === "validate" && (
          <p>비밀번호가 일치하지 않습니다</p>
        )}
        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" value="submit" disabled={isLoading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to="/login">
          이미 아이디가 있으신가요?
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
