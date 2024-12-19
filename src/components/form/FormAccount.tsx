import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LiaCameraRetroSolid } from "react-icons/lia";
import { v4 as uuid4 } from "uuid";
import * as yup from "yup";
import { globalColors } from "../../data/data";
import { useOS } from "../../hooks/useOS";
import useStore from "../../store/useStore";
import {
  get_user_by_id,
  register_user,
  UPDATE_USER,
  update_user,
} from "../../utils/invoke";
import { saveImageLocally } from "../../utils/utils";
import { Background } from "../apps/settings/account/Background";
import { Button } from "../common/Button";
import { Form } from "../common/Form";
import { Input } from "../common/Input";
import { ProfilePhoto } from "../common/ProfilePhoto";
import { ErrorText } from "../common/TextError";

const schema = yup
  .object({
    username: yup.string().required("El nombre de usuario es obligatorio."),
    password: yup.string().required("La contraseña es obligatoria."),
    role: yup.string().required("El rol es obligatorio."),
    photo: yup
      .mixed<FileList>()
      .nullable()
      .test(
        "fileSize",
        "El archivo es demasiado grande.",
        (value) => !value || (value[0] && value[0].size <= 5 * 1024 * 1024),
      )
      .test(
        "fileType",
        "Solo se permiten imágenes.",
        (value) =>
          !value ||
          (value[0] && ["image/jpeg", "image/png"].includes(value[0].type)),
      ),
    photoPath: yup.string(),
    background: yup
      .mixed<FileList>()
      .nullable()
      .test(
        "fileSize",
        "El archivo es demasiado grande.",
        (value) => !value || (value[0] && value[0].size <= 5 * 1024 * 1024),
      )
      .test(
        "fileType",
        "Solo se permiten imágenes.",
        (value) =>
          !value ||
          (value[0] && ["image/jpeg", "image/png"].includes(value[0].type)),
      ),
    backgroundPath: yup.string(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface FormAccountProps {
  id?: string;
  buttonText?: string;
  lastUpdate: () => void;
}

export const FormAccount = ({
  id,
  buttonText,
  lastUpdate,
}: FormAccountProps) => {
  const { t } = useTranslation();

  const { currentUser } = useOS();

  const color = useStore((store) => store.config.color);

  const [photoPreview, setPhotoPreview] = useState<string>("no_photo");
  const [backgroundPreview, setBackgroundPreview] =
    useState<string>("no_background");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchUser = async () => {
    if (id) {
      const user = await get_user_by_id(id);

      if (user) {
        reset({
          username: user.username || "",
          password: user.password || "",
          role: user.role || "",
          backgroundPath: user.background || "",
          photoPath: user.photo || "",
        });

        setPhotoPreview(user.photo || "no_photo");
        setBackgroundPreview(user.background || "no_background");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const formFields = [
    {
      placeholder: t(`username`),
      name: "username",
      type: "text",
      error: errors.username?.message,
    },
    {
      placeholder: t(`password`),
      name: "password",
      type: "password",
      error: errors.password?.message,
    },
  ];

  const onSubmit = async (data: FormData) => {
    const {
      username,
      password,
      role,
      photo,
      background,
      backgroundPath,
      photoPath,
    } = data;

    let newPhotoPath = null;
    let newBackgroundPath = null;

    if (photo) {
      newPhotoPath = await saveImageLocally(photo[0], `photo-${username}.jpg`);
    }
    if (background) {
      newBackgroundPath = await saveImageLocally(
        background[0],
        `background-${username}.jpg`,
      );
    }

    // Construir un objeto con solo los cambios
    const updatedFields: Partial<UPDATE_USER> = {};
    if (id) {
      const user = await get_user_by_id(id);

      if (username !== user.username) {
        updatedFields.newUsername = username;
      }
      if (password !== user.password) {
        updatedFields.newPassword = password;
      }
      if (role !== user.role) {
        updatedFields.newRole = role;
      }
      if ((newPhotoPath || photoPath) !== user.photo) {
        updatedFields.newPhotoPath = newPhotoPath || photoPath;
      }
      if ((newBackgroundPath || backgroundPath) !== user.background) {
        updatedFields.newBackgroundPath = newBackgroundPath || backgroundPath;
      }

      // Verificar si hay cambios
      if (Object.keys(updatedFields).length > 0) {
        updatedFields.id = id;

        update_user({
          id: id,
          ...updatedFields,
        } as UPDATE_USER)
          .then((res) => {
            alert(res);
            lastUpdate();
          })
          .catch((e) => alert(e));
      } else {
        alert("No changes detected.");
      }
    } else {
      const id = uuid4();
      register_user(
        id,
        username,
        password,
        role,
        newPhotoPath,
        newBackgroundPath,
      )
        .then((res) => {
          alert(res);
          lastUpdate();
        })
        .catch((e) => alert(e));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setValue("photo", e.target.files);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundPreview(URL.createObjectURL(file));
      setValue("background", e.target.files);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="relative">
        {backgroundPreview && <Background bg={backgroundPreview} />}

        <div
          className={`absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center shadow-md transition ${globalColors.bg[color].base} ${globalColors.bg[color].lightHover} border`}
        >
          <LiaCameraRetroSolid />

          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleBackgroundChange}
            className="absolute inset-0 h-full w-full opacity-0"
          />
        </div>

        <div className="absolute right-1/2 top-[25px]">
          {photoPreview && <ProfilePhoto photo={photoPreview} mini />}
          <div
            className={`absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md transition ${globalColors.bg[color].base} ${globalColors.bg[color].lightHover} border`}
          >
            <LiaCameraRetroSolid />

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoChange}
              className="absolute inset-0 h-full w-full opacity-0"
            />
          </div>
        </div>
      </div>

      {errors.photo && (
        <div className="mt-4">
          <ErrorText>{errors.photo.message}</ErrorText>
        </div>
      )}

      {errors.background && (
        <div className="mt-4">
          <ErrorText>{errors.background.message}</ErrorText>
        </div>
      )}

      {formFields.map((field) => (
        <div key={field.name}>
          <Input
            placeholder={field.placeholder}
            type={field.type}
            error={field.error}
            {...register(field.name as keyof FormData)}
          />
          {field.error && <ErrorText>{field.error}</ErrorText>}
        </div>
      ))}

      {currentUser.role === "admin" && (
        <select
          className="light-text-normal w-1/2 rounded-lg border border-zinc-700 bg-zinc-800 p-2 focus:outline-none dark:border-zinc-300 dark:bg-zinc-200"
          {...register("role")}
        >
          <option value={"user"}>{t(`user`)}</option>
          <option value={"admin"}>{t(`admin`)}</option>
        </select>
      )}

      <Button type="submit">
        {buttonText ?? (id ? t(`Update user`) : t(`Create user`))}
      </Button>
    </Form>
  );
};
