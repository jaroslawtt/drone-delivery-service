import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UseFormSetValue,
  type Control,
  type DefaultValues,
  type FieldErrors,
  type FieldValues,
  type Mode,
  type UseFormGetValues,
  type UseFormHandleSubmit,
  type UseFormProps,
  type UseFormReset,
  type FormState,
  type UseFormWatch,
  type UseFormTrigger,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import { type ValidationSchema } from "~/libs/types/types.js";

type Parameters<T extends FieldValues = FieldValues> = {
  defaultValues: DefaultValues<T>;
  validationSchema?: ValidationSchema;
  mode?: Mode;
};

type ReturnValue<T extends FieldValues = FieldValues> = {
  control: Control<T, null>;
  errors: FieldErrors<T>;
  formState: FormState<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  handleReset: UseFormReset<T>;
  handleValuesGet: UseFormGetValues<T>;
  handleSetValue: UseFormSetValue<T>;
  handleWatch: UseFormWatch<T>;
  handleTrigger: UseFormTrigger<T>;
};

const useAppForm = <T extends FieldValues = FieldValues>({
  validationSchema,
  defaultValues,
  mode = "onSubmit",
}: Parameters<T>): ReturnValue<T> => {
  let parameters: UseFormProps<T> = {
    mode,
    defaultValues,
  };

  if (validationSchema) {
    parameters = {
      ...parameters,
      resolver: zodResolver(validationSchema),
    };
  }
  const {
    control,
    handleSubmit,
    formState,
    reset: handleReset,
    getValues: handleValuesGet,
    setValue: handleSetValue,
    watch: handleWatch,
    trigger: handleTrigger,
  } = useForm<T>(parameters);

  const errors = formState.errors;

  return {
    control,
    errors,
    formState,
    handleSubmit,
    handleReset,
    handleValuesGet,
    handleSetValue,
    handleWatch,
    handleTrigger,
  };
};

export { useAppForm };
