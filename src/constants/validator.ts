import {
  FixedRouteOrderForm,
  IFixedRoute,
  InputLocation,
  IUser,
} from "../types";

export const authValidator: ValidatorObject<keyof IUser> = {
  phone: {
    required: {
      message: "Số điện thoại không được để trống.",
    },
    regex: {
      value: function (value: string): boolean {
        return /^(0|\+84)(\s?[3-9]){1}(\d\s?){8}/.test(value.trim());
      },
      message: "Số điện thoại không hợp lệ.",
    },
  },
  name: {
    required: {
      message: "Tên không được để trống",
    },
    // regex: {
    //   value: function (value: string): boolean {
    //     const regex = /[^a-zA-Z\s]+/g;
    //     return !value.trim().match(regex)?.length;
    //   },
    //   message: "Tên không được chứa số và kí tự đặc biệt.",
    // },
  },
  password: {
    required: {
      message: "Mật khẩu không được để trống.",
    },
    regex: {
      value: function (value: string): boolean {
        return /^\S*$/g.test(value.trim());
      },
      message: "Mật khẩu không được chứa khoảng trắng.",
    },
    max: {
      value: 12,
      message: "Mật khẩu bao gồm từ 6 - 12 kí tự.",
    },
    min: {
      value: 6,
      message: "Mật khẩu bao gồm từ 6 - 12 kí tự.",
    },
  },
  email: {
    // required: {
    //   message: "Hòm thư điện tử không được bỏ trống.",
    // },
    regex: {
      value: function (value: string): boolean {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(
          value.trim()
        );
      },
      message: "Hòm thư điện tử không đúng định dạng.",
    },
  },
  role: {
    required: {
      message: "Bạn là khách hàng hay tài xế.",
    },
  },
} as ValidatorObject<keyof IUser>;

export const fixedRouteValidator: ValidatorObject<keyof IFixedRoute> = {
  user_id: {
    required: {
      message: "Tuyến cố định này chưa có người lái xe.",
    },
  },
  startLocation: {
    required: {
      message: "Bạn cần thêm điểm bắt đầu cho chuyến đi.",
    },
  },
  endLocation: {
    required: {
      message: "Bạn cần thêm điểm kết thúc cho chuyến đi.",
    },
  },
  departureTime: {
    required: {
      message: "Bạn cần thêm thời điểm bắt đầu chuyến đi.",
    },
  },
  totalSeats: {
    required: {
      message: "Số ghế ngồi không được để trống.",
    },
    regex: {
      value(total) {
        return /^[1-9]+[0-9]*/g.test(total.trim());
      },
      message: "Số ghế phải nhập số.",
    },
  },
  price: {
    required: {
      message: "Giá không được để trống.",
    },
  },
} as ValidatorObject<keyof IFixedRoute>;

export const locationValidator: ValidatorObject<keyof InputLocation> = {
  display_name: {
    required: {
      message: "Bạn cần thêm địa điểm",
    },
  },
  lat: {},
  lon: {},
};

export const fixedRouteOrderValidator: ValidatorObject<
  keyof FixedRouteOrderForm
> = {
  phone: {
    required: {
      message: "Số điện thoại không được để trống.",
    },
    regex: {
      value: function (value: string): boolean {
        return /^(0|\+84)(\s?[3-9]){1}(\d\s?){8}/.test(value.trim());
      },
      message: "Số điện thoại không hợp lệ.",
    },
  },
  name: {
    required: {
      message: "Tên không được để trống",
    },
    // regex: {
    //   value: function (value: string): boolean {
    //     const regex = /[^a-zA-Z\s]+/g;
    //     return !value.trim().match(regex)?.length;
    //   },
    //   message: "Tên không được chứa số và kí tự đặc biệt.",
    // },
  },
  note: {},
  location: {}
};
