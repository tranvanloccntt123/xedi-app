type FunctionValidateForm = {
    value: (value: string) => boolean;
    message: string;
};

type RequiredValidateForm<T = string> = {
    value?: T;
    message: string;
};

type ConfigValidateForm = {
    required?: RequiredValidateForm;
    regex?: FunctionValidateForm;
    customs?: FunctionValidateForm[];
    max?: RequiredValidateForm<number>;
    min?: RequiredValidateForm<number>;
};

type ValidatorObject<T = string> = Record<T, ConfigValidateForm>;

type AuthForm = 'phone' | 'name' | 'password' | 'email' | 'role';

type ValidatorResult = { status: boolean; message?: string };