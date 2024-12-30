import React, { useState } from 'react';
import { Box } from '@/src/components/ui/box';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { FormControl } from '@/src/components/ui/form-control';
import { Heading } from '@/src/components/ui/heading';
import { Input } from '@/src/components/ui/input';
import { InputField } from '@/src/components/ui/input';
import { VStack } from '@/src/components/ui/vstack';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '@/src/store/authSlice';
import { setUser } from '@/src/store/userSlice';
import { Text } from '@/src/components/ui/text';
import { HStack } from '@/src/components/ui/hstack';
import { Link, useRouter } from 'expo-router';
import { Select } from '@/src/components/ui/select';
import { SelectTrigger } from '@/src/components/ui/select';
import { SelectInput } from '@/src/components/ui/select';
import { SelectPortal } from '@/src/components/ui/select';
import { SelectBackdrop } from '@/src/components/ui/select';
import { SelectContent } from '@/src/components/ui/select';
import { SelectDragIndicator } from '@/src/components/ui/select';
import { SelectItem } from '@/src/components/ui/select';
import { IUser } from '@/src/types';

export default function SignUp() {
  const [user, setUserState] = useState<Partial<IUser>>({
    name: '',
    phone: '',
    password: '',
    email: '',
    role: 'customer',
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (key: keyof IUser, value: string | number) => {
    setUserState(prevUser => ({ ...prevUser, [key]: value }));
  };

  const handleSignUp = () => {
    // TODO: Implement actual sign-up logic with API call
    // For now, we'll simulate a successful sign-up
    const newUser: IUser = {
      id: Date.now().toString(), // Temporary ID generation
      name: user.name || '',
      phone: user.phone || '',
      password: user.password || '',
      email: user.email || '',
      role: user.role as 'customer' | 'driver',
      vehicleId: user.vehicleId,
      createdAt: new Date(),
    };
    dispatch(setUser(newUser));
    dispatch(setAuthenticated(newUser));
    router.replace('/');
  };

  return (
    <Box className="flex-1 bg-white">
      <HStack className="flex-1 flex-col lg:flex-row">
        <VStack space="xl" className="w-full h-full lg:w-3/12 p-4 lg:p-8 z-10 bg-white overflow-y-auto">
          <VStack space="xs" className="mb-6">
            <Heading size="2xl">Đăng ký Xedi</Heading>
            <Text>Tạo tài khoản mới</Text>
          </VStack>
          <FormControl className="mb-2 w-full">
            <Text className="mb-2 text-sm font-medium text-gray-700">Họ và tên</Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập họ và tên"
                value={user.name}
                onChangeText={(value) => handleChange('name', value)}
              />
            </Input>
          </FormControl>
          <FormControl className="mb-2 w-full">
            <Text className="mb-2 text-sm font-medium text-gray-700">Số điện thoại</Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập số điện thoại"
                value={user.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
              />
            </Input>
          </FormControl>
          <FormControl className="mb-2 w-full">
            <Text className="mb-2 text-sm font-medium text-gray-700">Mật khẩu</Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập mật khẩu"
                value={user.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
              />
            </Input>
          </FormControl>
          <FormControl className="mb-2 w-full">
            <Text className="mb-2 text-sm font-medium text-gray-700">Email</Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Nhập email"
                value={user.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
              />
            </Input>
          </FormControl>
          <FormControl className="mb-2 w-full">
            <Text className="mb-2 text-sm font-medium text-gray-700">Vai trò</Text>
            <Select
              selectedValue={user.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectInput placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicator />
                  <SelectItem label="Khách hàng" value="customer" />
                  <SelectItem label="Tài xế" value="driver" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
          {user.role === 'driver' && (
            <FormControl className="mb-2 w-full">
              <Text className="mb-2 text-sm font-medium text-gray-700">ID Phương tiện</Text>
              <Input variant="outline" size="md">
                <InputField
                  placeholder="Nhập ID phương tiện"
                  value={user.vehicleId}
                  onChangeText={(value) => handleChange('vehicleId', value)}
                />
              </Input>
            </FormControl>
          )}
          <Button size="lg" className="w-full bg-blue-500" onPress={handleSignUp}>
            <ButtonText className="text-white">Đăng ký</ButtonText>
          </Button>
          <Text className="text-center mt-4">
            Đã có tài khoản?{' '}
            <Link href="/sign-in" className="text-blue-500">
              Đăng nhập
            </Link>
          </Text>
        </VStack>
        <VStack className="w-full lg:w-9/12 absolute lg:relative z-0 h-full bg-primary-200 p-4 lg:p-8 items-center justify-center">
          <Heading size="xl" className="text-center mb-4">Chào mừng đến với Xedi</Heading>
          <Text className="text-center mb-4">Ứng dụng đặt xe và giao đồ ăn hàng đầu Việt Nam</Text>
          <VStack space="md" className="items-center">
            <Text className="font-bold">Tính năng nổi bật:</Text>
            <Text>✓ Đặt xe nhanh chóng</Text>
            <Text>✓ Giao đồ ăn tiện lợi</Text>
            <Text>✓ Thanh toán an toàn</Text>
            <Text>✓ Ưu đãi hấp dẫn mỗi ngày</Text>
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
}

