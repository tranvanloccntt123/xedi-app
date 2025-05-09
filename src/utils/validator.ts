export const formValidate = (
  config: ConfigValidateForm,
  value: string
): ValidatorResult => {
  if (!config) {
    return {
      message: "",
      status: true,
    };
  }
  let message = "";
  if (config.required && !value) {
    message = config.required.message;
  } else if (!config.required && !value) {
    return {
      message: "",
      status: true,
    }
  }
  if (message === "" && config.max && value.length > (config.max?.value ?? 0)) {
    message = config.max.message;
  }
  if (message === "" && config.min && value.length < (config.min?.value ?? 0)) {
    message = config.min.message;
  }
  if (message === "" && config.regex && !config.regex?.value?.(value ?? "")) {
    message = config.regex.message;
  }
  if (message === "" && config.customs && config.customs.length) {
    for (const custom of config.customs) {
      if (message !== "") {
        break;
      }
      if (!custom.value(value)) {
        message = custom.message;
      }
    }
  }
  return {
    message,
    status: message === "",
  };
};

export const formValidatePerField = (
  validator: ValidatorObject,
  form: Record<string, string>
) => {
  const res: Record<string, ValidatorResult> = {};
  Object.keys(form).forEach((key) => {
    res[key] = formValidate(validator[key], form[key]);
  });
  return res;
};

export const formValidateSuccess = (
  validate: Record<string, ValidatorResult>
) => {
  return Object.values(validate).filter((v) => v.status === false).length === 0;
};
