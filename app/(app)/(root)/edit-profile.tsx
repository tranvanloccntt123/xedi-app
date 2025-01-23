const APP_STRUCT = "EDIT_PROFILE_SCREEN"

import React, { useState } from "react"
import { useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/src/store/store"
import { updateUser } from "@/src/store/userSlice"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { FormControl, FormControlLabel } from "@/src/components/ui/form-control"
import { ScrollView } from "react-native"

export default function EditProfile() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name,
        email,
        phone,
      }
      dispatch(updateUser(updatedUser))
      router.back()
    }
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Chỉnh sửa hồ sơ
          </Heading>
          <VStack space="md">
            <FormControl>
              <FormControlLabel>Họ và tên</FormControlLabel>
              <Input>
                <InputField value={name} onChangeText={setName} />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>Email</FormControlLabel>
              <Input>
                <InputField value={email} onChangeText={setEmail} keyboardType="email-address" />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>Số điện thoại</FormControlLabel>
              <Input>
                <InputField value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </Input>
            </FormControl>
            <Button size="lg" className="mt-4" onPress={handleSave}>
              <ButtonText>Lưu thay đổi</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

